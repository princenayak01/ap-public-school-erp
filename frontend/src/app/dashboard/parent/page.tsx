'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import {
  HeartHandshake,
  GraduationCap,
  CalendarCheck2,
  CreditCard,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  PlusCircle,
  FilePlus,
  ArrowRight
} from 'lucide-react';

interface ChildStudent {
  id: string;
  admissionNo: string;
  name: string;
  class: string;
  rollNo: string | number;
  dob?: string;
  attendancePct?: number;
  feeStatus?: 'PAID' | 'PENDING';
  pendingMonth?: string;
  pendingAmount?: number;
  recentExamGrade?: string;
}

// Canonical Parent-to-Child Registry: Strict 1-to-1 Family Isolation
const PARENT_CHILD_DIRECTORY: Record<string, ChildStudent> = {
  // 1. Sharma Family (Manoj Sharma / Vikas Sharma)
  '9876543213': {
    id: 'std-001',
    admissionNo: 'APPS/2026/001',
    name: 'Aarav Sharma',
    class: 'Class 4 - Section A',
    rollNo: '01',
    dob: '2016-04-12',
    attendancePct: 95.0,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'A1 (CBSE)',
  },
  '9876543214': {
    id: 'std-001',
    admissionNo: 'APPS/2026/001',
    name: 'Aarav Sharma',
    class: 'Class 4 - Section A',
    rollNo: '01',
    dob: '2016-04-12',
    attendancePct: 95.0,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'A1 (CBSE)',
  },
  'parent.sharma@gmail.com': {
    id: 'std-001',
    admissionNo: 'APPS/2026/001',
    name: 'Aarav Sharma',
    class: 'Class 4 - Section A',
    rollNo: '01',
    dob: '2016-04-12',
    attendancePct: 95.0,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'A1 (CBSE)',
  },

  // 2. Verma Family (Sanjay Verma)
  '9876543216': {
    id: 'std-002',
    admissionNo: 'APPS/2026/002',
    name: 'Ananya Verma',
    class: 'Class 1 - Section B',
    rollNo: '02',
    dob: '2019-08-20',
    attendancePct: 96.5,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'A1 (CBSE)',
  },
  'parent.verma@gmail.com': {
    id: 'std-002',
    admissionNo: 'APPS/2026/002',
    name: 'Ananya Verma',
    class: 'Class 1 - Section B',
    rollNo: '02',
    dob: '2019-08-20',
    attendancePct: 96.5,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'A1 (CBSE)',
  },

  // 3. Singh Family (Gurpreet Singh)
  '9876543218': {
    id: 'std-003',
    admissionNo: 'APPS/2026/003',
    name: 'Kabir Singh',
    class: 'Class 8 - Section A',
    rollNo: '03',
    dob: '2012-11-10',
    attendancePct: 92.0,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'B1 (CBSE)',
  },
  'parent.singh@gmail.com': {
    id: 'std-003',
    admissionNo: 'APPS/2026/003',
    name: 'Kabir Singh',
    class: 'Class 8 - Section A',
    rollNo: '03',
    dob: '2012-11-10',
    attendancePct: 92.0,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'B1 (CBSE)',
  },

  // 4. Nayak Family (Prince Nayak)
  '7309720610': {
    id: 'std-004',
    admissionNo: 'APPS/2026/004',
    name: 'Amit Nayak',
    class: 'Class 4 - Section A',
    rollNo: '04',
    dob: '2016-01-05',
    attendancePct: 94.5,
    feeStatus: 'PAID',
    pendingMonth: 'None',
    pendingAmount: 0,
    recentExamGrade: 'A1 (CBSE)',
  },
};

export default function ParentPortal() {
  const [children, setChildren] = useState<ChildStudent[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildStudent | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let u: any = null;
    try {
      const storedUser = localStorage.getItem('apps_user');
      const token = localStorage.getItem('apps_token');
      if (!storedUser || !token) {
        window.location.replace('/login/parent');
        return;
      }
      u = JSON.parse(storedUser);
      if (u.role !== 'PARENT' && u.role !== 'PRINCIPAL') {
        window.location.replace('/login/parent');
        return;
      }
      setCurrentUser(u);
    } catch (e) {
      window.location.replace('/login/parent');
      return;
    }
    fetchChildren(u);
  }, []);

  const fetchChildren = async (activeUser?: any) => {
    try {
      setLoading(true);
      const user = activeUser || currentUser || (() => {
        try {
          const raw = localStorage.getItem('apps_user');
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })();

      const token = typeof window !== 'undefined' ? localStorage.getItem('apps_token') : null;
      const norm = (val?: string) => (val || '').replace(/[^0-9]/g, '').slice(-10);
      const pPhone = norm(user?.phone);
      const pEmail = (user?.email || '').toLowerCase().trim();

      let assignedChild: ChildStudent | null = null;

      // 1. Direct 1-to-1 phone lookup in parent directory
      if (pPhone && PARENT_CHILD_DIRECTORY[pPhone]) {
        assignedChild = PARENT_CHILD_DIRECTORY[pPhone];
      }
      // 2. Direct 1-to-1 email lookup in parent directory
      else if (pEmail && PARENT_CHILD_DIRECTORY[pEmail]) {
        assignedChild = PARENT_CHILD_DIRECTORY[pEmail];
      }
      // 3. Registered child if parent enrolled their ward online
      else if (user?.childName) {
        assignedChild = {
          id: user.childAdmissionNo || 'std-reg-01',
          admissionNo: user.childAdmissionNo || 'APPS/2026/REG',
          name: user.childName,
          class: user.className || 'Class 4',
          rollNo: user.rollNumber || '01',
          dob: '—',
          attendancePct: 95.0,
          feeStatus: 'PAID',
          pendingMonth: 'None',
          pendingAmount: 0,
          recentExamGrade: 'A1 (CBSE)',
        };
      }
      // 4. Query secured dedicated API for newly admitted students
      else {
        try {
          const res = await fetch(`/api/v1/parent/my-children?phone=${pPhone}&email=${encodeURIComponent(pEmail)}`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          });
          if (res.ok) {
            const json = await res.json();
            const list = json.data || [];
            if (list.length > 0) {
              const s = list[0];
              assignedChild = {
                id: s.id,
                admissionNo: s.admissionNo || `APPS/${s.id}`,
                name: `${s.firstName} ${s.lastName || ''}`.trim(),
                class: s.className || s.class?.name || 'Class 4',
                rollNo: s.rollNumber || s.rollNo || '01',
                dob: s.dateOfBirth || s.dob || '—',
                attendancePct: 95.0,
                feeStatus: 'PAID',
                pendingMonth: 'None',
                pendingAmount: 0,
                recentExamGrade: 'A1 (CBSE)',
              };
            }
          }
        } catch (e) {
          console.warn('Backend lookup skipped, using strict local isolation');
        }
      }

      // If user is Principal previewing the parent portal, show single preview ward
      if (!assignedChild && user?.role === 'PRINCIPAL') {
        assignedChild = PARENT_CHILD_DIRECTORY['9876543213'];
      }

      // STRICT ISOLATION: A parent dashboard NEVER has multiple unrelated children
      if (assignedChild) {
        setChildren([assignedChild]);
        setSelectedChild(assignedChild);
      } else {
        setChildren([]);
        setSelectedChild(null);
      }
    } catch (e) {
      console.warn('Failed to resolve child data:', e);
      setChildren([]);
      setSelectedChild(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFee = () => {
    if (!selectedChild) return;
    setSuccessMsg(`Online payment of ₹${selectedChild.pendingAmount} for ${selectedChild.name} successful! Receipt REC-2026-98124 issued.`);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userRole="PARENT" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Parent Portal • A. P PUBLIC SCHOOL" />

        <main className="p-3.5 sm:p-6 pb-24 md:pb-8 space-y-4 sm:space-y-6">
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Parent Header: Dedicated 1-to-1 Student Ward Info */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Verified Parent Account • Private Student Ward
              </span>
              <h1 className="text-xl font-bold mt-1.5">
                {currentUser?.name || 'Parent Guardian'}&apos;s Portal
              </h1>
              <p className="text-xs text-slate-300">A. P PUBLIC SCHOOL, Jhansi • CBSE Affiliated Portal</p>
            </div>

            {/* Prominent Single Ward Banner (No multiple children mixed) */}
            {selectedChild && (
              <div className="bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-teal-500/30 flex items-center space-x-3 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm border border-teal-500/40 shrink-0">
                  {selectedChild.name[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>{selectedChild.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {selectedChild.class}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Adm: {selectedChild.admissionNo} • Roll: {selectedChild.rollNo}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Empty State when zero students belong to this parent */}
          {children.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Users className="w-8 h-8" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                🔒 Data Privacy & Child Safety Active
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-3">Aapka Baccha Abhi Link Nahi Hai</h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
                School Data Protection Policy ke tehat, Parent Login par <b>sirf aapke apne bacche ka data</b> hi show hota hai, kisi doosre student ka nahi.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl max-w-md mx-auto my-4 text-left text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Logged in Parent:</span>
                  <span className="font-bold text-slate-800">{currentUser?.name || 'Parent Guardian'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Phone:</span>
                  <span className="font-mono font-bold text-indigo-700">{currentUser?.phone || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-mono text-slate-700">{currentUser?.email || '—'}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                Yadi admission ho chuka hai to kripya School Office / Principal se sampark karke apna mobile number register karwayein.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => fetchChildren()}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>
          ) : selectedChild ? (
            /* Child Active Profile Banner */
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center font-bold text-white text-xl">
                    {selectedChild.name[0] || 'S'}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">{selectedChild.name}</h2>
                    <p className="text-xs text-slate-500">
                      Admission No: <span className="font-mono font-bold text-indigo-900">{selectedChild.admissionNo}</span> • Roll No: {selectedChild.rollNo}
                    </p>
                    <p className="text-xs text-teal-600 font-semibold">{selectedChild.class}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`/api/v1/exams/report-card/${selectedChild.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report Card</span>
                  </a>
                </div>
              </div>

              {/* Child 3 Cards: Attendance, Fees, Exam */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Attendance */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
                    <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>Attendance Compliance</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-600">{selectedChild.attendancePct}%</div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedChild.attendancePct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">Meets CBSE 75% minimum requirement</p>
                </div>

                {/* Fee Status */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Tuition Fee Dues</span>
                  </div>
                  {selectedChild.feeStatus === 'PENDING' ? (
                    <>
                      <div className="text-2xl font-black text-rose-600">₹{selectedChild.pendingAmount}</div>
                      <p className="text-[11px] text-slate-600 font-medium mt-1">Due for {selectedChild.pendingMonth}</p>
                      <Link
                        href="/dashboard/fees"
                        className="mt-2 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md block text-center transition-all"
                      >
                        Pay Online via Razorpay
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-black text-teal-600">All Clear</div>
                      <p className="text-[11px] text-teal-700 font-semibold mt-1">✓ No pending fees for this session</p>
                      <Link
                        href="/dashboard/fees"
                        className="mt-2 w-full py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200 block text-center transition-all"
                      >
                        View Official Receipt
                      </Link>
                    </>
                  )}
                </div>

                {/* Exam Results */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                    <span>Academic Result</span>
                  </div>
                  <div className="text-2xl font-black text-indigo-900">{selectedChild.recentExamGrade}</div>
                  <p className="text-[11px] text-slate-600 font-medium mt-1">Mid-Term Examination 2026</p>
                  <div className="mt-2 text-[10px] text-slate-500">
                    Principal Remarks: Promoted with commendable performance.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
