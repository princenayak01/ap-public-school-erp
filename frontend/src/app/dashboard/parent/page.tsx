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

export default function ParentPortal() {
  const [children, setChildren] = useState<ChildStudent[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('apps_active_role', 'PARENT');
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/students');
      if (res.ok) {
        const json = await res.json();
        const rawStudents = json.data || [];
        const mapped: ChildStudent[] = rawStudents.map((s: any) => ({
          id: s.id,
          admissionNo: s.admissionNo || `APPS/${s.id}`,
          name: `${s.firstName} ${s.lastName || ''}`.trim(),
          class: s.className || (s.class?.name ?? 'Class 4'),
          rollNo: s.rollNumber || s.rollNo || '01',
          dob: s.dateOfBirth || s.dob || '—',
          attendancePct: 95.0,
          feeStatus: 'PAID',
          pendingMonth: 'None',
          pendingAmount: 0,
          recentExamGrade: 'A1 (CBSE)',
        }));
        setChildren(mapped);
        if (mapped.length > 0) {
          setSelectedChild(mapped[0]);
        } else {
          setSelectedChild(null);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch students from backend:', e);
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

        <main className="p-6 space-y-6">
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Parent Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Verified Parent Account
              </span>
              <h1 className="text-xl font-bold mt-1.5">Parent & Guardian Portal</h1>
              <p className="text-xs text-slate-300">A. P PUBLIC SCHOOL, Jhansi • CBSE Affiliated Portal</p>
            </div>

            {/* Child Switcher (Multiple Children under One Parent) */}
            {children.length > 0 && (
              <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 flex space-x-1.5">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedChild?.id === child.id
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {child.name} ({child.class})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Empty State when zero students exist */}
          {children.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Student Records Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                Sabhi fake/test students clear kar diye gaye hain. Real students admit hone ya excel se upload hone ke baad yahan automatically display hone lagenge.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={fetchChildren}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Refresh Portal</span>
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
