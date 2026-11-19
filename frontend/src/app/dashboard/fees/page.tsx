'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import FinancialYearSelect from '@/components/FinancialYearSelect';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Printer,
  X,
  Search,
  Check,
  Calendar,
  Building2,
  UserCheck,
} from 'lucide-react';

const CANONICAL_FALLBACK_STUDENTS = [
  {
    id: 'std-002',
    firstName: 'Aarav',
    lastName: 'Sharma',
    name: 'Aarav Sharma',
    className: 'Class 4',
    sectionName: 'A',
    rollNumber: '02',
    rollNo: '02',
    admissionNo: 'APPS/2026/002',
    parentName: 'Manoj Sharma',
    fatherName: 'Manoj Sharma',
    parentPhone: '9876543213',
    phone: '9876543213',
    parentEmail: 'parent.sharma@gmail.com',
    email: 'parent.sharma@gmail.com',
  },
  {
    id: 'std-003',
    firstName: 'Ananya',
    lastName: 'Verma',
    name: 'Ananya Verma',
    className: 'Class 1',
    sectionName: 'B',
    rollNumber: '02',
    rollNo: '02',
    admissionNo: 'APPS/2026/003',
    parentName: 'Sanjay Verma',
    fatherName: 'Sanjay Verma',
    parentPhone: '9876543216',
    phone: '9876543216',
    parentEmail: 'parent.verma@gmail.com',
    email: 'parent.verma@gmail.com',
  },
  {
    id: 'std-004',
    firstName: 'Kabir',
    lastName: 'Singh',
    name: 'Kabir Singh',
    className: 'Class 8',
    sectionName: 'A',
    rollNumber: '03',
    rollNo: '03',
    admissionNo: 'APPS/2026/004',
    parentName: 'Rajesh Singh',
    fatherName: 'Rajesh Singh',
    parentPhone: '9876543218',
    phone: '9876543218',
    parentEmail: 'parent.singh@gmail.com',
    email: 'parent.singh@gmail.com',
  },
  {
    id: 'std-001',
    firstName: 'Amit',
    lastName: 'Nayak',
    name: 'Amit Nayak',
    className: 'Class 4',
    sectionName: 'A',
    rollNumber: '01',
    rollNo: '01',
    admissionNo: 'APPS/2026/001',
    parentName: 'Prince Nayak',
    fatherName: 'Prince Nayak',
    parentPhone: '7309720610',
    phone: '7309720610',
    parentEmail: 'prince.nayak@gmail.com',
    email: 'prince.nayak@gmail.com',
  },
];

const CBSE_FEE_TERMS = [
  {
    id: 'ALL',
    label: 'All Terms (Full Session)',
    shortLabel: 'All Terms',
    period: 'April 2026 – March 2027',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    months: [
      'April 2026', 'May 2026', 'June 2026',
      'July 2026', 'August 2026', 'September 2026',
      'October 2026', 'November 2026', 'December 2026',
      'January 2027', 'February 2027', 'March 2027'
    ],
  },
  {
    id: 'TERM_1',
    label: 'Term 1 (April – June)',
    shortLabel: 'Term 1 (Q1)',
    period: 'April – June',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    months: ['Full Term 1 (Apr – Jun)', 'April 2026', 'May 2026', 'June 2026'],
  },
  {
    id: 'TERM_2',
    label: 'Term 2 (July – September)',
    shortLabel: 'Term 2 (Q2)',
    period: 'July – September',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    months: ['Full Term 2 (Jul – Sep)', 'July 2026', 'August 2026', 'September 2026'],
  },
  {
    id: 'TERM_3',
    label: 'Term 3 (October – December)',
    shortLabel: 'Term 3 (Q3)',
    period: 'October – December',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    months: ['Full Term 3 (Oct – Dec)', 'October 2026', 'November 2026', 'December 2026'],
  },
  {
    id: 'TERM_4',
    label: 'Term 4 (January – March)',
    shortLabel: 'Term 4 (Q4)',
    period: 'January – March',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    months: ['Full Term 4 (Jan – Mar)', 'January 2027', 'February 2027', 'March 2027'],
  },
];

function resolveFeeTerm(termOrMonth?: string) {
  if (!termOrMonth) return CBSE_FEE_TERMS[1];
  const s = termOrMonth.toLowerCase();
  if (s.includes('term 1') || s.includes('q1') || s.includes('apr') || s.includes('may') || s.includes('jun')) {
    return CBSE_FEE_TERMS[1];
  }
  if (s.includes('term 2') || s.includes('q2') || s.includes('jul') || s.includes('aug') || s.includes('sep')) {
    return CBSE_FEE_TERMS[2];
  }
  if (s.includes('term 3') || s.includes('q3') || s.includes('oct') || s.includes('nov') || s.includes('dec')) {
    return CBSE_FEE_TERMS[3];
  }
  if (s.includes('term 4') || s.includes('q4') || s.includes('jan') || s.includes('feb') || s.includes('mar')) {
    return CBSE_FEE_TERMS[4];
  }
  return CBSE_FEE_TERMS[1];
}

const INITIAL_FALLBACK_INVOICES = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-2026-001',
    receiptNo: 'REC-2026-001',
    studentName: 'Aarav Sharma',
    class: 'Class 4',
    rollNo: '02',
    admissionNo: 'APPS/2026/002',
    fatherName: 'Manoj Sharma',
    parentName: 'Manoj Sharma',
    parentPhone: '9876543213',
    phone: '9876543213',
    parentEmail: 'parent.sharma@gmail.com',
    email: 'parent.sharma@gmail.com',
    term: 'Term 1 (April – June)',
    month: 'April 2026',
    feeHead: 'Tuition Fee (Session 2026-27)',
    total: 2000,
    paid: 1000,
    balance: 1000,
    status: 'PARTIAL',
    paymentMode: 'CASH',
    createdAt: '2026-11-18',
    remarks: 'Partial Tuition Fee Paid, Remaining Due: ₹1000',
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-2026-002',
    receiptNo: 'REC-2026-002',
    studentName: 'Ananya Verma',
    class: 'Class 1',
    rollNo: '02',
    admissionNo: 'APPS/2026/003',
    fatherName: 'Sanjay Verma',
    parentName: 'Sanjay Verma',
    parentPhone: '9876543216',
    phone: '9876543216',
    parentEmail: 'parent.verma@gmail.com',
    email: 'parent.verma@gmail.com',
    term: 'Term 1 (April – June)',
    month: 'April 2026',
    feeHead: 'Tuition Fee (Session 2026-27)',
    total: 1800,
    paid: 0,
    balance: 1800,
    status: 'PENDING',
    paymentMode: 'CASH',
    createdAt: '2026-11-18',
    remarks: 'Pending Tuition Fee',
  },
  {
    id: 'inv-003',
    invoiceNo: 'INV-2026-003',
    receiptNo: 'REC-2026-003',
    studentName: 'Kabir Singh',
    class: 'Class 8',
    rollNo: '03',
    admissionNo: 'APPS/2026/004',
    fatherName: 'Rajesh Singh',
    parentName: 'Rajesh Singh',
    parentPhone: '9876543218',
    phone: '9876543218',
    parentEmail: 'parent.singh@gmail.com',
    email: 'parent.singh@gmail.com',
    term: 'Term 1 (April – June)',
    month: 'Full Term 1 (Apr – Jun)',
    feeHead: 'Tuition Fee (Session 2026-27)',
    total: 2200,
    paid: 2200,
    balance: 0,
    status: 'PAID',
    paymentMode: 'ONLINE_RAZORPAY',
    createdAt: '2026-11-18',
    remarks: 'No Due - Full Fee Cleared',
  },
  {
    id: 'inv-004',
    invoiceNo: 'INV-2026-004',
    receiptNo: 'REC-2026-004',
    studentName: 'Amit Nayak',
    class: 'Class 4',
    rollNo: '01',
    admissionNo: 'APPS/2026/001',
    fatherName: 'Prince Nayak',
    parentName: 'Prince Nayak',
    parentPhone: '7309720610',
    phone: '7309720610',
    parentEmail: 'prince.nayak@gmail.com',
    email: 'prince.nayak@gmail.com',
    term: 'Term 1 (April – June)',
    month: 'April 2026',
    feeHead: 'Tuition Fee (Session 2026-27)',
    total: 2000,
    paid: 0,
    balance: 2000,
    status: 'PENDING',
    paymentMode: 'CASH',
    createdAt: '2026-11-18',
    remarks: 'Pending Tuition Fee',
  },
];

function numberToWords(num: number): string {
  if (!num || num === 0) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return n.toString();
  }
  return inWords(num) + ' Rupees Only';
}

export default function FeesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [showRazorpayModal, setShowRazorpayModal] = useState<any>(null);
  const [showOfflineModal, setShowOfflineModal] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState<any>(null);

  const [offlineAmount, setOfflineAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>('CASH');
  const [successMsg, setSuccessMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeRole, setActiveRole] = useState<'TEACHER' | 'PARENT' | 'PRINCIPAL'>('PRINCIPAL');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months (Apr - Mar)');
  const [selectedTermFilter, setSelectedTermFilter] = useState<string>('ALL');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Universal Student Fee Search & Quick Due Clearance (Principal)
  const [universalSearch, setUniversalSearch] = useState<string>('');
  const [selectedStudentForDues, setSelectedStudentForDues] = useState<any | null>(null);
  const [showClearDuesModal, setShowClearDuesModal] = useState<boolean>(false);
  const [clearDuesAmount, setClearDuesAmount] = useState<number>(0);
  const [clearDuesMode, setClearDuesMode] = useState<string>('CASH');
  const [clearDuesTerm, setClearDuesTerm] = useState<string>('TERM_1');
  const [clearDuesMonth, setClearDuesMonth] = useState<string>('April 2026');
  const [clearDuesRemarks, setClearDuesRemarks] = useState<string>('');

  // Offline Payment Modal Term/Month
  const [offlineTerm, setOfflineTerm] = useState<string>('TERM_1');
  const [offlineMonth, setOfflineMonth] = useState<string>('April 2026');

  // Manual Receipt Form State
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    className: 'Class 4',
    rollNo: '01',
    admissionNo: '',
    term: 'TERM_1',
    month: 'April 2026',
    feeHead: 'Tuition Fee (Session 2026-27)',
    totalAmount: '2000',
    amountPaid: '2000',
    paymentMode: 'CASH',
    remarks: '',
  });

  // Load invoices, students & detect active role
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('apps_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.role === 'TEACHER' || u.role === 'PARENT' || u.role === 'PRINCIPAL') {
          setActiveRole(u.role);
          if (u.role === 'TEACHER') return;
        }
      }
    } catch (e) {}

    const stored = localStorage.getItem('apps_active_role');
    if (stored === 'TEACHER' || stored === 'PARENT' || stored === 'PRINCIPAL') {
      setActiveRole(stored);
      if (stored === 'TEACHER') return;
    }

    async function loadInvoices(currentStudents: any[] = []) {
      try {
        const res = await fetch('/api/v1/fees/invoices');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          let list = data.data;
          const uStr = localStorage.getItem('apps_user');
          const u = uStr ? JSON.parse(uStr) : null;
          if (u && u.role === 'PARENT') {
            const norm = (val?: string) => (val || '').replace(/[^0-9]/g, '').slice(-10);
            const pPhone = norm(u.phone);
            const pEmail = (u.email || '').toLowerCase().trim();
            list = list.filter((inv: any) => {
              if (u.childName && inv.studentName && inv.studentName.toLowerCase().includes(u.childName.toLowerCase())) return true;
              if (u.childAdmissionNo && inv.admissionNo === u.childAdmissionNo) return true;
              if (pPhone && inv.parentPhone && norm(inv.parentPhone) === pPhone) return true;
              if (pEmail && inv.parentEmail && inv.parentEmail.toLowerCase().trim() === pEmail) return true;
              return false;
            });
          }

          setInvoices(
            list.map((inv: any) => {
              const matchedStudent = currentStudents.find(
                (s) =>
                  (inv.admissionNo && s.admissionNo === inv.admissionNo) ||
                  (inv.studentName && s.firstName && inv.studentName.toLowerCase().includes(s.firstName.toLowerCase()))
              );
              return {
                id: inv.id,
                invoiceNo: inv.invoiceNo,
                receiptNo: inv.receiptNumber || `REC-2026-${String(inv.id).slice(-3)}`,
                studentName: inv.studentName,
                class: inv.className,
                rollNo: inv.rollNo || '01',
                admissionNo: inv.admissionNo || `APPS/${inv.id}`,
                fatherName: inv.fatherName || inv.parentName || matchedStudent?.parentName || matchedStudent?.fatherName || 'Parent Guardian',
                parentName: inv.parentName || inv.fatherName || matchedStudent?.parentName || 'Parent Guardian',
                parentPhone: inv.parentPhone || inv.phone || matchedStudent?.parentPhone || '+91-9876543210',
                phone: inv.phone || inv.parentPhone || matchedStudent?.parentPhone || '+91-9876543210',
                parentEmail: inv.parentEmail || inv.email || matchedStudent?.parentEmail || '',
                email: inv.email || inv.parentEmail || matchedStudent?.parentEmail || '',
                term: inv.term || resolveFeeTerm(inv.month).label,
                month: inv.month || 'April 2026',
                feeHead: inv.feeHead || 'Tuition Fee',
                total: Number(inv.totalAmount) || 0,
                paid: Number(inv.paidAmount) || 0,
                balance: Number(inv.balanceAmount) || 0,
                status: inv.status,
                paymentMode: inv.paymentMode || 'CASH',
                createdAt: inv.createdAt || '2026-11-18',
                remarks: inv.remarks,
              };
            })
          );
        } else {
          setInvoices(INITIAL_FALLBACK_INVOICES);
        }
      } catch (err) {
        console.warn('Using fallback fee ledger');
        setInvoices(INITIAL_FALLBACK_INVOICES);
      }
    }

    async function loadStudents() {
      let merged = [...CANONICAL_FALLBACK_STUDENTS];
      try {
        const res = await fetch('/api/v1/students');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const apiStudents = data.data.map((st: any) => ({
            id: st.id,
            firstName: st.firstName,
            lastName: st.lastName || '',
            name: `${st.firstName} ${st.lastName || ''}`.trim(),
            className: st.className || 'Class 4',
            sectionName: st.sectionName || 'A',
            rollNumber: String(st.rollNumber || st.rollNo || '01'),
            rollNo: String(st.rollNumber || st.rollNo || '01'),
            admissionNo: st.admissionNo || `APPS/2026/${st.id}`,
            parentName: st.parentName || st.fatherName || 'Parent Guardian',
            fatherName: st.fatherName || st.parentName || 'Parent Guardian',
            parentPhone: st.parentPhone || st.phone || '+91-9876543210',
            phone: st.phone || st.parentPhone || '+91-9876543210',
            parentEmail: st.parentEmail || st.email || '',
            email: st.email || st.parentEmail || '',
          }));

          // Avoid duplicates by admissionNo or phone
          const existingAdms = new Set(apiStudents.map((s: any) => s.admissionNo));
          const nonDupFallbacks = CANONICAL_FALLBACK_STUDENTS.filter((f) => !existingAdms.has(f.admissionNo));
          merged = [...apiStudents, ...nonDupFallbacks];
        }
      } catch (e) {}
      setStudentsList(merged);
      loadInvoices(merged);
    }

    loadStudents();
  }, []);

  // Real-time automatic calculations for manual fee entry
  const curTotal = Math.max(0, Number(formData.totalAmount) || 0);
  const curPaid = Math.max(0, Number(formData.amountPaid) || 0);
  const curBalance = Math.max(0, curTotal - curPaid);
  const isNoDue = curTotal > 0 && curBalance === 0;
  const isPartial = curBalance > 0 && curPaid > 0;
  const isUnpaid = curTotal > 0 && curPaid === 0;

  // Student selection helper
  const handleSelectStudent = (studentId: string) => {
    if (!studentId) {
      setFormData((prev) => ({ ...prev, studentId: '' }));
      return;
    }
    const found = studentsList.find((s) => s.id === studentId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        studentId: found.id,
        studentName: `${found.firstName} ${found.lastName || ''}`.trim(),
        className: found.className || (found.class?.name ?? 'Class 4'),
        rollNo: String(found.rollNumber || found.rollNo || '01'),
        admissionNo: found.admissionNo || `APPS/2026/${found.id}`,
      }));
    }
  };

  // Submit manual fee & auto-create receipt
  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim()) {
      alert('Kripya Student ka naam enter karein ya student select karein.');
      return;
    }
    if (curTotal <= 0) {
      alert('Total Fee Amount ₹0 se adhik honi chahiye.');
      return;
    }

    setProcessing(true);
    const count = invoices.length + 1;
    const autoReceiptNo = `REC-2026-${String(count).padStart(3, '0')}`;
    const autoInvoiceNo = `INV-2026-${String(count).padStart(3, '0')}`;
    const dateToday = new Date().toISOString().split('T')[0];

    const termLabel = CBSE_FEE_TERMS.find((t) => t.id === formData.term)?.label || formData.term;

    const payload = {
      studentId: formData.studentId || `std-custom-${Date.now()}`,
      studentName: formData.studentName,
      className: formData.className,
      rollNo: formData.rollNo,
      admissionNo: formData.admissionNo || `APPS/2026/${String(count).padStart(3, '0')}`,
      term: termLabel,
      month: formData.month,
      feeHead: formData.feeHead,
      totalAmount: curTotal,
      amountPaid: curPaid,
      paymentMode: formData.paymentMode,
      remarks: formData.remarks || (isNoDue ? 'No Due - Full Fee Cleared' : `Partial Fee Paid, Remaining Due: ₹${curBalance}`),
    };

    try {
      const res = await fetch('/api/v1/fees/create-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const serverInv = data.data?.invoice;

      const newInv = {
        id: serverInv?.id || `inv-${Date.now()}`,
        invoiceNo: serverInv?.invoiceNo || autoInvoiceNo,
        receiptNo: serverInv?.receiptNumber || autoReceiptNo,
        studentName: payload.studentName,
        class: payload.className,
        rollNo: payload.rollNo,
        admissionNo: payload.admissionNo,
        term: termLabel,
        month: payload.month,
        feeHead: payload.feeHead,
        total: curTotal,
        paid: curPaid,
        balance: curBalance,
        status: isNoDue ? 'PAID' : curPaid > 0 ? 'PARTIAL' : 'PENDING',
        paymentMode: payload.paymentMode,
        createdAt: dateToday,
        remarks: payload.remarks,
      };

      setInvoices((prev) => [newInv, ...prev]);
      setShowCreateModal(false);

      // Open official printable receipt modal with NO DUE / Balance status
      setActiveReceiptModal(newInv);
      setSuccessMsg(`Official Fee Receipt ${newInv.receiptNo} auto-generated! ${isNoDue ? 'Status: ✓ NO DUE' : `Balance: ₹${curBalance}`}`);
    } catch (err: any) {
      const fallbackInv = {
        id: `inv-${Date.now()}`,
        invoiceNo: autoInvoiceNo,
        receiptNo: autoReceiptNo,
        studentName: payload.studentName,
        class: payload.className,
        rollNo: payload.rollNo,
        admissionNo: payload.admissionNo,
        term: termLabel,
        month: payload.month,
        feeHead: payload.feeHead,
        total: curTotal,
        paid: curPaid,
        balance: curBalance,
        status: isNoDue ? 'PAID' : curPaid > 0 ? 'PARTIAL' : 'PENDING',
        paymentMode: payload.paymentMode,
        createdAt: dateToday,
        remarks: payload.remarks,
      };
      setInvoices((prev) => [fallbackInv, ...prev]);
      setShowCreateModal(false);
      setActiveReceiptModal(fallbackInv);
      setSuccessMsg(`Fee Receipt ${autoReceiptNo} created! ${isNoDue ? 'Status: ✓ NO DUE' : `Balance: ₹${curBalance}`}`);
    } finally {
      setProcessing(false);
      setTimeout(() => setSuccessMsg(''), 7000);
    }
  };

  const handleRazorpayPay = (invoice: any) => {
    setShowRazorpayModal(invoice);
  };

  const confirmRazorpayPayment = async () => {
    if (!showRazorpayModal) return;
    setProcessing(true);
    const invId = showRazorpayModal.id;

    try {
      const res = await fetch('/api/v1/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invId,
          amountPaid: showRazorpayModal.balance || showRazorpayModal.total,
          paymentMode: 'ONLINE_RAZORPAY',
          transactionId: `pay_apps_${Date.now()}`,
        }),
      });
      const data = await res.json();
      const receiptNo = data.data?.payment?.receiptNumber || `REC-2026-${Date.now().toString().slice(-5)}`;

      let updatedTarget: any = null;
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === invId) {
            updatedTarget = { ...inv, paid: inv.total, balance: 0, status: 'PAID', receiptNo };
            return updatedTarget;
          }
          return inv;
        })
      );

      setShowRazorpayModal(null);
      setSuccessMsg(data.message || `Online payment verified via Razorpay! Receipt Generated: ${receiptNo}`);
      if (updatedTarget) {
        setActiveReceiptModal(updatedTarget);
      }
    } catch (err: any) {
      const nextRec = `REC-2026-${Date.now().toString().slice(-5)}`;
      let updatedTarget: any = null;
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === invId) {
            updatedTarget = { ...inv, paid: inv.total, balance: 0, status: 'PAID', receiptNo: nextRec };
            return updatedTarget;
          }
          return inv;
        })
      );
      setShowRazorpayModal(null);
      setSuccessMsg(`Online payment recorded! Receipt Generated: ${nextRec}`);
      if (updatedTarget) {
        setActiveReceiptModal(updatedTarget);
      }
    } finally {
      setProcessing(false);
      setTimeout(() => setSuccessMsg(''), 6000);
    }
  };

  const handleOfflinePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOfflineModal) return;
    setProcessing(true);
    const invId = showOfflineModal.id;
    const offlineTermLabel = CBSE_FEE_TERMS.find((t) => t.id === offlineTerm)?.label || offlineTerm;

    try {
      const res = await fetch('/api/v1/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invId,
          amountPaid: Number(offlineAmount),
          paymentMode,
          term: offlineTermLabel,
          month: offlineMonth,
          transactionId: `CASH_${Date.now()}`,
        }),
      });
      const data = await res.json();
      const receiptNo = data.data?.payment?.receiptNumber || `REC-2026-${Date.now().toString().slice(-5)}`;

      let updatedTarget: any = null;
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === invId) {
            const newPaid = inv.paid + Number(offlineAmount);
            const newBal = Math.max(0, inv.total - newPaid);
            updatedTarget = {
              ...inv,
              paid: newPaid,
              balance: newBal,
              status: newBal === 0 ? 'PAID' : 'PARTIAL',
              receiptNo,
              term: offlineTermLabel,
              month: offlineMonth || inv.month,
            };
            return updatedTarget;
          }
          return inv;
        })
      );

      setShowOfflineModal(null);
      setSuccessMsg(data.message || `Payment of ₹${offlineAmount} recorded for ${offlineTermLabel}! Receipt: ${receiptNo}`);
      if (updatedTarget) {
        setActiveReceiptModal(updatedTarget);
      }
    } catch (err: any) {
      const nextRec = `REC-2026-${Date.now().toString().slice(-5)}`;
      let updatedTarget: any = null;
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === invId) {
            const newPaid = inv.paid + Number(offlineAmount);
            const newBal = Math.max(0, inv.total - newPaid);
            updatedTarget = {
              ...inv,
              paid: newPaid,
              balance: newBal,
              status: newBal === 0 ? 'PAID' : 'PARTIAL',
              receiptNo: nextRec,
              term: offlineTermLabel,
              month: offlineMonth || inv.month,
            };
            return updatedTarget;
          }
          return inv;
        })
      );
      setShowOfflineModal(null);
      setSuccessMsg(`Payment of ₹${offlineAmount} recorded! Receipt: ${nextRec}`);
      if (updatedTarget) {
        setActiveReceiptModal(updatedTarget);
      }
    } finally {
      setProcessing(false);
      setTimeout(() => setSuccessMsg(''), 6000);
    }
  };

  // Helper: compute financial record for any student
  const getStudentFeeSummary = (student: any) => {
    if (!student) return { invoices: [], totalBilled: 0, totalPaid: 0, totalBalance: 0, status: 'NO_RECORD' };
    const norm = (val?: string) => (val || '').replace(/[^0-9]/g, '').slice(-10);
    const stPhone = norm(student.parentPhone || student.phone);
    const stEmail = (student.parentEmail || student.email || '').toLowerCase().trim();
    const stAdm = (student.admissionNo || '').trim();
    const stName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().trim();

    const matchedInvoices = invoices.filter((inv) => {
      if (stAdm && inv.admissionNo === stAdm) return true;
      if (stPhone && inv.parentPhone && norm(inv.parentPhone) === stPhone) return true;
      if (stEmail && inv.parentEmail && inv.parentEmail.toLowerCase().trim() === stEmail) return true;
      if (stName && inv.studentName && inv.studentName.toLowerCase().includes(stName)) return true;
      return false;
    });

    const totalBilled = matchedInvoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
    const totalPaid = matchedInvoices.reduce((sum, inv) => sum + (Number(inv.paid) || 0), 0);
    const totalBalance = matchedInvoices.reduce((sum, inv) => sum + (Number(inv.balance) || 0), 0);

    return {
      invoices: matchedInvoices,
      totalBilled: matchedInvoices.length > 0 ? totalBilled : 2000,
      totalPaid,
      totalBalance: matchedInvoices.length > 0 ? totalBalance : (2000 - totalPaid),
      status: matchedInvoices.length > 0 && totalBalance === 0 ? 'PAID' : (totalPaid > 0 ? 'PARTIAL' : 'PENDING'),
    };
  };

  // Live matching students for Universal Search
  const matchingStudents = studentsList.filter((s: any) => {
    if (!universalSearch.trim()) return false;
    const q = universalSearch.toLowerCase().trim();
    const normQ = q.replace(/[^0-9]/g, '');

    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().trim();
    const father = `${s.parentName || ''} ${s.fatherName || ''}`.toLowerCase().trim();
    const phone = (s.parentPhone || s.phone || '').replace(/[^0-9]/g, '');
    const email = (s.parentEmail || s.email || '').toLowerCase().trim();
    const adm = (s.admissionNo || '').toLowerCase().trim();
    const roll = String(s.rollNumber || s.rollNo || '').trim();
    const cls = (s.className || '').toLowerCase().trim();

    return (
      fullName.includes(q) ||
      father.includes(q) ||
      (normQ.length >= 3 && phone.includes(normQ)) ||
      (q.includes('@') ? email.includes(q) : email.includes(q)) ||
      adm.includes(q) ||
      roll === q ||
      cls.includes(q)
    );
  });

  // Fast Due Clearance Submit Handler
  const handleClearDuesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForDues) return;
    setProcessing(true);

    const st = selectedStudentForDues;
    const count = invoices.length + 1;
    const autoReceiptNo = `REC-2026-${String(count).padStart(3, '0')}`;
    const autoInvoiceNo = `INV-2026-${String(count).padStart(3, '0')}`;
    const dateToday = new Date().toISOString().split('T')[0];

    const targetInv = invoices.find((inv) =>
      (st.admissionNo && inv.admissionNo === st.admissionNo && inv.balance > 0) ||
      (st.firstName && inv.studentName?.toLowerCase().includes(st.firstName.toLowerCase()) && inv.balance > 0)
    );

    const amountToClear = Number(clearDuesAmount) || 0;
    const fatherName = st.parentName || st.fatherName || 'Parent Guardian';
    const parentPhone = st.parentPhone || st.phone || '+91-9876543210';
    const parentEmail = st.parentEmail || st.email || '';

    const termLabel = CBSE_FEE_TERMS.find((t) => t.id === clearDuesTerm)?.label || clearDuesTerm;

    const payload = {
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName || ''}`.trim(),
      className: st.className || 'Class 4',
      rollNo: st.rollNumber || st.rollNo || '01',
      admissionNo: st.admissionNo || `APPS/2026/${String(count).padStart(3, '0')}`,
      fatherName,
      parentPhone,
      parentEmail,
      term: termLabel,
      month: clearDuesMonth,
      feeHead: 'Tuition Fee (Session 2026-27)',
      totalAmount: targetInv ? targetInv.total : amountToClear,
      amountPaid: amountToClear,
      paymentMode: clearDuesMode,
      remarks: clearDuesRemarks || (amountToClear >= (targetInv?.balance || amountToClear) ? 'No Due - Full Fee Cleared by Principal' : `Partial Fee Deposit of ₹${amountToClear}`),
      invoiceId: targetInv?.id,
    };

    try {
      const res = await fetch('/api/v1/fees/create-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const serverInv = data.data?.invoice;
      const receiptNo = data.data?.receiptNo || autoReceiptNo;

      const updatedInv = {
        id: serverInv?.id || targetInv?.id || `inv-${Date.now()}`,
        invoiceNo: serverInv?.invoiceNo || targetInv?.invoiceNo || autoInvoiceNo,
        receiptNo: receiptNo,
        studentName: payload.studentName,
        class: payload.className,
        rollNo: payload.rollNo,
        admissionNo: payload.admissionNo,
        fatherName: payload.fatherName,
        parentPhone: payload.parentPhone,
        parentEmail: payload.parentEmail,
        term: termLabel,
        month: payload.month,
        feeHead: payload.feeHead,
        total: targetInv ? targetInv.total : amountToClear,
        paid: (targetInv ? targetInv.paid : 0) + amountToClear,
        balance: Math.max(0, (targetInv ? targetInv.balance : amountToClear) - amountToClear),
        status: (Math.max(0, (targetInv ? targetInv.balance : amountToClear) - amountToClear) === 0) ? 'PAID' : 'PARTIAL',
        paymentMode: clearDuesMode,
        createdAt: dateToday,
        remarks: payload.remarks,
      };

      setInvoices((prev) => {
        const exists = prev.some((i) => i.id === updatedInv.id);
        if (exists) {
          return prev.map((i) => (i.id === updatedInv.id ? updatedInv : i));
        }
        return [updatedInv, ...prev];
      });

      setShowClearDuesModal(false);
      setActiveReceiptModal(updatedInv);
      setSuccessMsg(`Fee payment of ₹${amountToClear} submitted for ${termLabel} (${clearDuesMonth})! Receipt ${receiptNo} generated.`);
    } catch (err) {
      const fallbackInv = {
        id: targetInv?.id || `inv-${Date.now()}`,
        invoiceNo: targetInv?.invoiceNo || autoInvoiceNo,
        receiptNo: autoReceiptNo,
        studentName: payload.studentName,
        class: payload.className,
        rollNo: payload.rollNo,
        admissionNo: payload.admissionNo,
        fatherName: payload.fatherName,
        parentPhone: payload.parentPhone,
        parentEmail: payload.parentEmail,
        term: termLabel,
        month: payload.month,
        feeHead: payload.feeHead,
        total: targetInv ? targetInv.total : amountToClear,
        paid: (targetInv ? targetInv.paid : 0) + amountToClear,
        balance: Math.max(0, (targetInv ? targetInv.balance : amountToClear) - amountToClear),
        status: (Math.max(0, (targetInv ? targetInv.balance : amountToClear) - amountToClear) === 0) ? 'PAID' : 'PARTIAL',
        paymentMode: clearDuesMode,
        createdAt: dateToday,
        remarks: payload.remarks,
      };
      setInvoices((prev) => {
        const exists = prev.some((i) => i.id === fallbackInv.id);
        if (exists) {
          return prev.map((i) => (i.id === fallbackInv.id ? fallbackInv : i));
        }
        return [fallbackInv, ...prev];
      });
      setShowClearDuesModal(false);
      setActiveReceiptModal(fallbackInv);
      setSuccessMsg(`Fee payment of ₹${amountToClear} recorded! Receipt ${autoReceiptNo} generated.`);
    } finally {
      setProcessing(false);
      setTimeout(() => setSuccessMsg(''), 7000);
    }
  };

  // Filter invoices according to selected Financial Year (April to March) and selected month
  const filteredInvoices = invoices.filter((inv) => {
    // Check Date range if invoice has createdAt/date
    const invDateStr = inv.createdAt || inv.date || '';
    if (invDateStr) {
      const d = new Date(invDateStr);
      if (!isNaN(d.getTime())) {
        const fyStart = new Date(selectedYear, 3, 1); // 1 April selectedYear
        const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59); // 31 March selectedYear + 1
        if (d < fyStart || d > fyEnd) {
          // If invoice explicitly mentions session year
          if (!inv.month?.includes(String(selectedYear)) && !inv.month?.includes(String(selectedYear + 1).slice(-2))) {
            return false;
          }
        }
      }
    }

    if (selectedMonth && selectedMonth !== 'All Months (Apr - Mar)') {
      if (inv.month && !inv.month.toLowerCase().includes(selectedMonth.toLowerCase())) {
        return false;
      }
    }

    // Filter by CBSE 4 Terms (Quarter)
    if (selectedTermFilter && selectedTermFilter !== 'ALL') {
      const invTermObj = resolveFeeTerm(inv.term || inv.month);
      if (invTermObj.id !== selectedTermFilter) {
        return false;
      }
    }

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      const normQ = q.replace(/[^0-9]/g, '');
      const match =
        inv.studentName?.toLowerCase().includes(q) ||
        inv.fatherName?.toLowerCase().includes(q) ||
        inv.parentName?.toLowerCase().includes(q) ||
        inv.parentEmail?.toLowerCase().includes(q) ||
        inv.term?.toLowerCase().includes(q) ||
        inv.month?.toLowerCase().includes(q) ||
        (normQ.length >= 3 && (inv.parentPhone || inv.phone)?.replace(/[^0-9]/g, '').includes(normQ)) ||
        inv.admissionNo?.toLowerCase().includes(q) ||
        inv.receiptNo?.toLowerCase().includes(q) ||
        inv.invoiceNo?.toLowerCase().includes(q) ||
        String(inv.rollNo).includes(q) ||
        inv.class?.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const filteredStudentsForSelect = studentsList.filter((s) => {
    if (!studentSearchQuery.trim()) return true;
    const q = studentSearchQuery.toLowerCase().trim();
    const normQ = q.replace(/[^0-9]/g, '');
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const father = `${s.parentName || ''} ${s.fatherName || ''}`.toLowerCase();
    const phone = (s.parentPhone || s.phone || '').replace(/[^0-9]/g, '');
    const email = (s.parentEmail || s.email || '').toLowerCase();
    const adm = (s.admissionNo || '').toLowerCase();
    const roll = String(s.rollNumber || s.rollNo || '');
    const cls = (s.className || '').toLowerCase();
    return (
      fullName.includes(q) ||
      father.includes(q) ||
      (normQ.length >= 3 && phone.includes(normQ)) ||
      email.includes(q) ||
      adm.includes(q) ||
      roll.includes(q) ||
      cls.includes(q)
    );
  });

  const totalBilled = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  const totalCollected = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.paid) || 0), 0);
  const totalPending = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.balance) || 0), 0);
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';
  const billedCount = filteredInvoices.length;

  if (activeRole === 'TEACHER') {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar userRole="TEACHER" />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Fees Management (Restricted)" />
          <main className="p-4 sm:p-8 pb-24 md:pb-8 max-w-2xl mx-auto w-full my-auto text-center">
            <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-800">Access Restricted for Class Teachers</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Aap Class Teacher ke roop me logged in hain. School fees aur financial collection ka access sirf <strong>School Principal & Accounts</strong> ke paas hai.
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left space-y-1">
                <p className="font-bold">Class Teacher Permissions:</p>
                <p>1. Students Admission & Roll Number Assignment (`/dashboard/students`)</p>
                <p>2. Daily Classroom Attendance (`/dashboard/attendance`)</p>
                <p>3. Class Timetable Schedule (`/dashboard/timetable`)</p>
                <p>4. Manual Marks Upload & Report Card Creation (`/dashboard/exams`)</p>
              </div>
              <div className="pt-2">
                <Link
                  href="/dashboard/teacher"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center space-x-2 shadow-md transition-all"
                >
                  <span>Return to Teacher Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Fees Management & Razorpay Gateway" />

        <main className="p-3.5 sm:p-6 pb-24 md:pb-8 space-y-4 sm:space-y-6">
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Metric Overview (Principal Only - Dynamic based on live data) */}
          {activeRole === 'PRINCIPAL' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/70 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700">Financial / Academic Year Data:</span>
                  <span className="text-xs text-slate-500">Filter all metrics and invoices (April to March)</span>
                </div>
                <FinancialYearSelect
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Billed ({selectedMonth === 'All Months (Apr - Mar)' ? `Apr ${selectedYear} - Mar ${selectedYear + 1}` : selectedMonth})</span>
                  <h3 className="text-2xl font-black text-slate-800 mt-2">₹{totalBilled.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{billedCount} invoices in this period</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Total Collected</span>
                  <h3 className="text-2xl font-black text-teal-700 mt-2">₹{totalCollected.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-teal-600 font-semibold mt-1">{collectionRate}% Collection Efficiency</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Outstanding Dues</span>
                  <h3 className="text-2xl font-black text-amber-600 mt-2">₹{totalPending.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {totalPending > 0 ? 'Pending collection in this session' : '✓ All fee accounts up to date (No Dues)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Parent Dedicated Ward Fee Portal View */}
          {activeRole === 'PARENT' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      Parent Fee Portal
                    </span>
                    <h2 className="text-base font-extrabold text-slate-800 mt-1">Ward Tuition Fee Status</h2>
                    <p className="text-xs text-slate-500">Pay school tuition securely online via Razorpay or view official receipts</p>
                  </div>
                  <Link
                    href="/dashboard/parent"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    ← Back to Parent Dashboard
                  </Link>
                </div>

                {invoices.length === 0 ? (
                  <div className="py-12 text-center max-w-md mx-auto space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">All Clear • No Pending Tuition Fees</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Aapke ward ke naam par is session ki koi bhi fee pending nahi hai. Jab school accounts dwara naya invoice issue hoga, tab yahan Razorpay payment option show hoga.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                              {inv.receiptNo || inv.invoiceNo}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{inv.studentName}</span>
                            <span className="text-[11px] text-slate-500">({inv.class})</span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Month: <strong>{inv.month}</strong> • Total Tuition: <strong>₹{inv.total}</strong> • Paid: <strong>₹{inv.paid}</strong>
                          </p>
                          <div className="flex items-center space-x-2 pt-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : inv.status === 'PARTIAL'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {inv.status === 'PAID' ? '✓ NO DUE / PAID' : inv.status}
                            </span>
                            {inv.balance > 0 && (
                              <span className="text-xs font-bold text-rose-600">Pending Dues: ₹{inv.balance}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {inv.status !== 'PAID' ? (
                            <button
                              onClick={() => handleRazorpayPay(inv)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Online (₹{inv.balance})</span>
                            </button>
                          ) : null}
                          <button
                            onClick={() => setActiveReceiptModal(inv)}
                            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold text-xs flex items-center space-x-1.5 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View / Print Receipt</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PRINCIPAL UNIVERSAL STUDENT SEARCH & INSTANT DUE CLEARANCE                */}
          {/* ========================================================================= */}
          {activeRole === 'PRINCIPAL' && (
            <div className="bg-white rounded-3xl border-2 border-indigo-200/90 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Search Student & Clear Pending Dues / Submit Fee
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Direct search by <strong>Student Name</strong>, <strong>Mobile Number</strong>, <strong>Father's Name</strong>, or <strong>Email</strong> to view dues & clear them instantly.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 self-start sm:self-auto flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Principal Direct Access</span>
                </span>
              </div>

              {/* Live Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={universalSearch}
                  onChange={(e) => setUniversalSearch(e.target.value)}
                  placeholder="Type student name (e.g. Aarav), mobile no (9876543213), father name (Manoj Sharma), or email..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-300 bg-slate-50/60 hover:bg-white text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                />
                {universalSearch && (
                  <button
                    onClick={() => {
                      setUniversalSearch('');
                    }}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Search Pills:</span>
                {[
                  { label: 'Aarav Sharma (9876543213)', q: '9876543213' },
                  { label: 'Ananya Verma (9876543216)', q: '9876543216' },
                  { label: 'Kabir Singh (9876543218)', q: '9876543218' },
                  { label: 'Amit Nayak (7309720610)', q: '7309720610' },
                ].map((pill) => (
                  <button
                    key={pill.q}
                    type="button"
                    onClick={() => {
                      setUniversalSearch(pill.q);
                      const match = studentsList.find((s) => (s.parentPhone || s.phone || '').includes(pill.q));
                      if (match) {
                        setSelectedStudentForDues(match);
                        const summary = getStudentFeeSummary(match);
                        setClearDuesAmount(summary.totalBalance);
                      }
                    }}
                    className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-100 transition-colors"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Live Matching Results List (when searching) */}
              {universalSearch.trim() && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span>Matching Students Found ({matchingStudents.length})</span>
                    <span className="text-[10px] text-slate-400">Click a student to view fee dossier & clear dues</span>
                  </div>

                  {matchingStudents.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                      Koi student "{universalSearch}" se match nahi hua. Name, Mobile No, Father Name ya Email dobara check karein.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {matchingStudents.map((st: any) => {
                        const summary = getStudentFeeSummary(st);
                        const isSelected = selectedStudentForDues?.id === st.id;
                        return (
                          <div
                            key={st.id}
                            onClick={() => {
                              setSelectedStudentForDues(st);
                              setClearDuesAmount(summary.totalBalance);
                            }}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-black text-slate-900">
                                  {st.firstName} {st.lastName || ''}
                                </h4>
                                <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                                  {st.className} • Roll {st.rollNumber || st.rollNo} • {st.admissionNo}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  summary.totalBalance === 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {summary.totalBalance === 0 ? '✓ NO DUE' : `DUE: ₹${summary.totalBalance}`}
                              </span>
                            </div>

                            <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                              <p className="flex items-center space-x-1.5">
                                <span className="font-semibold text-slate-500">👨 Father:</span>
                                <span className="font-bold text-slate-800">{st.parentName || st.fatherName || 'Parent Guardian'}</span>
                              </p>
                              <p className="flex items-center space-x-1.5">
                                <span className="font-semibold text-slate-500">📞 Mobile:</span>
                                <span className="font-mono font-bold text-slate-800">{st.parentPhone || st.phone || '+91-9876543210'}</span>
                              </p>
                              {st.parentEmail && (
                                <p className="flex items-center space-x-1.5">
                                  <span className="font-semibold text-slate-500">✉ Email:</span>
                                  <span className="text-slate-700 truncate">{st.parentEmail}</span>
                                </p>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-medium text-slate-500">
                                Billed: ₹{summary.totalBilled} | Paid: ₹{summary.totalPaid}
                              </span>
                              <button
                                type="button"
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center space-x-1"
                              >
                                <span>{summary.totalBalance > 0 ? 'Clear Due' : 'View Record'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Student Fee Dossier Card */}
              {selectedStudentForDues && (
                <div className="rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50/50 via-white to-teal-50/40 p-5 sm:p-6 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-600 text-white">
                          Selected Student Record
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-900">{selectedStudentForDues.admissionNo}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mt-1">
                        {selectedStudentForDues.firstName} {selectedStudentForDues.lastName || ''}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {selectedStudentForDues.className} (Section {selectedStudentForDues.sectionName || 'A'}) • Roll Number: {selectedStudentForDues.rollNumber || selectedStudentForDues.rollNo || '01'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedStudentForDues(null)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold self-start sm:self-auto"
                    >
                      ✕ Close Profile
                    </button>
                  </div>

                  {/* Student & Parent Info Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white border border-indigo-100 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Father / Guardian</span>
                      <strong className="text-sm font-bold text-slate-900 mt-0.5 block">
                        👨 {selectedStudentForDues.parentName || selectedStudentForDues.fatherName || 'Parent Guardian'}
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-indigo-100 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Mobile</span>
                      <strong className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">
                        📞 {selectedStudentForDues.parentPhone || selectedStudentForDues.phone || '+91-9876543210'}
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-indigo-100 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Email</span>
                      <strong className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                        ✉ {selectedStudentForDues.parentEmail || selectedStudentForDues.email || 'N/A'}
                      </strong>
                    </div>
                  </div>

                  {/* Financial Breakdown & Action */}
                  {(() => {
                    const summary = getStudentFeeSummary(selectedStudentForDues);
                    return (
                      <div className="p-4 rounded-2xl bg-white border border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="border-r border-slate-200 pr-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Billed</span>
                            <span className="text-base font-black text-slate-900">₹{summary.totalBilled}</span>
                          </div>
                          <div className="border-r border-slate-200 pr-3">
                            <span className="text-[10px] uppercase font-bold text-teal-600 block">Total Paid</span>
                            <span className="text-base font-black text-teal-700">₹{summary.totalPaid}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-rose-600 block">Outstanding Due</span>
                            <span className={`text-base font-black ${summary.totalBalance === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ₹{summary.totalBalance}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {summary.totalBalance > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setClearDuesAmount(summary.totalBalance);
                                setClearDuesMonth('April 2026');
                                setClearDuesRemarks('Full Pending Dues Cleared by Principal');
                                setShowClearDuesModal(true);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center space-x-1.5"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Clear Pending Dues (₹{summary.totalBalance})</span>
                            </button>
                          ) : (
                            <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>All Clear • No Pending Dues</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const lastInv = summary.invoices[0] || {
                                id: `inv-${Date.now()}`,
                                invoiceNo: `INV-2026-001`,
                                receiptNo: `REC-2026-001`,
                                studentName: `${selectedStudentForDues.firstName} ${selectedStudentForDues.lastName || ''}`.trim(),
                                class: selectedStudentForDues.className,
                                rollNo: selectedStudentForDues.rollNumber || '01',
                                admissionNo: selectedStudentForDues.admissionNo,
                                fatherName: selectedStudentForDues.parentName || selectedStudentForDues.fatherName,
                                parentPhone: selectedStudentForDues.parentPhone,
                                parentEmail: selectedStudentForDues.parentEmail,
                                month: 'April 2026',
                                feeHead: 'Tuition Fee (Session 2026-27)',
                                total: 2000,
                                paid: 2000,
                                balance: 0,
                                status: 'PAID',
                                paymentMode: 'CASH',
                                createdAt: new Date().toISOString().split('T')[0],
                                remarks: 'Official Verified Fee Clearance',
                              };
                              setActiveReceiptModal(lastInv);
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-all"
                          >
                            <Printer className="w-4 h-4" />
                            <span>View / Print Receipt</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Fee Invoices Table (Principal Master Audit Ledger) */}
          {activeRole === 'PRINCIPAL' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Fee Invoices & Digital Audit Ledger</h3>
                  <p className="text-xs text-slate-500">Track tuition payments, auto-generate receipts with real-time No Due calculation</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search by Student Name / Roll / Receipt No */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search student name, roll, receipt..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {tableSearch && (
                      <button
                        onClick={() => setTableSearch('')}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Term Filter Dropdown (CBSE 4 Terms) */}
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Term:</span>
                    <select
                      value={selectedTermFilter}
                      onChange={(e) => setSelectedTermFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {CBSE_FEE_TERMS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setFormData({
                        studentId: '',
                        studentName: '',
                        className: 'Class 4',
                        rollNo: '01',
                        admissionNo: '',
                        term: 'TERM_1',
                        month: 'April 2026',
                        feeHead: 'Monthly Tuition Fee',
                        totalAmount: '2000',
                        amountPaid: '2000',
                        paymentMode: 'CASH',
                        remarks: '',
                      });
                      setStudentSearchQuery('');
                      setShowCreateModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Auto Create Fee Receipt / Manual Entry</span>
                  </button>
                  <span className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    Session 2026–27
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Receipt / Inv No</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Fee Term (Quarter)</th>
                      <th className="py-3 px-4">Submitted Month(s)</th>
                      <th className="py-3 px-4">Particulars</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Paid</th>
                      <th className="py-3 px-4">Balance</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-14 text-center">
                          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 border border-teal-100 shadow-inner">
                            <Receipt className="w-7 h-7" />
                          </div>
                          <p className="text-sm font-bold text-slate-800">No Invoices in Selected Period</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            April {selectedYear} – March {selectedYear + 1} ({selectedMonth}) ke liye koi fee invoice nahi mila. Naya receipt add karne ke liye upar button par click karein.
                          </p>
                          <button
                            onClick={() => {
                              setFormData({
                                studentId: '',
                                studentName: '',
                                className: 'Class 4',
                                rollNo: '01',
                                admissionNo: '',
                                term: 'TERM_1',
                                month: 'April 2026',
                                feeHead: 'Monthly Tuition Fee',
                                totalAmount: '2000',
                                amountPaid: '2000',
                                paymentMode: 'CASH',
                                remarks: '',
                              });
                              setShowCreateModal(true);
                            }}
                            className="mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Create Fee Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => {
                        const termObj = resolveFeeTerm(inv.term || inv.month);
                        return (
                          <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-indigo-900 block">{inv.receiptNo || inv.invoiceNo}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{inv.invoiceNo}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800 block">{inv.studentName}</span>
                              <span className="text-[10px] text-slate-500">
                                {inv.class} • Roll {inv.rollNo || '01'}
                              </span>
                            </td>
                            {/* DEDICATED COLUMN: Fee Term (Quarter) */}
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wide inline-block ${termObj.badgeClass}`}>
                                {termObj.shortLabel}
                              </span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{termObj.period}</span>
                            </td>
                            {/* DEDICATED COLUMN: Submitted Month(s) */}
                            <td className="py-3 px-4">
                              <span className="text-slate-900 font-bold block">{inv.month || 'April 2026'}</span>
                              <span className="text-[10px] text-teal-700 font-medium">Session 2026–27</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-slate-700 font-semibold">{inv.feeHead || 'Tuition Fee'}</span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">₹{inv.total}</td>
                            <td className="py-3 px-4 text-teal-700 font-semibold">₹{inv.paid}</td>
                            <td className="py-3 px-4 font-bold text-rose-600">
                              {inv.balance === 0 ? <span className="text-emerald-600 font-bold">₹0</span> : `₹${inv.balance}`}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  inv.status === 'PAID'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : inv.status === 'PARTIAL'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {inv.status === 'PAID' ? '✓ NO DUE' : inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setActiveReceiptModal(inv)}
                              className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[11px] inline-flex items-center space-x-1 border border-teal-200 transition-all"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>

                            {inv.status !== 'PAID' && (
                              <>
                                <button
                                  onClick={() => handleRazorpayPay(inv)}
                                  className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                                >
                                  Online
                                </button>
                                <button
                                  onClick={() => {
                                    setShowOfflineModal(inv);
                                    setOfflineAmount(inv.balance);
                                  }}
                                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                                >
                                  Cash/UPI
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODAL 1: AUTO CREATE RECEIPT & MANUAL AMOUNT ENTRY      */}
          {/* ======================================================== */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-xs my-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">Auto Create Fee Receipt & Manual Entry</h3>
                      <p className="text-[11px] text-slate-500">Amounts fill manually • Balance & No Due status auto-calculated</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateReceipt} className="space-y-4 mt-4">
                  {/* Select from Admitted Students (Live Search by Name) */}
                  {studentsList.length > 0 && (
                    <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-xs text-indigo-950 flex items-center space-x-1.5">
                          <Search className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Search Student by Name / Roll No:</span>
                        </label>
                        <span className="text-[10px] text-indigo-600 font-semibold">{studentsList.length} Students Admitted</span>
                      </div>

                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Type name to search (e.g. Aarav, Amit, Nayak)..."
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-8 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        />
                        {studentSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setStudentSearchQuery('')}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Matching suggestions dropdown */}
                      {studentSearchQuery.trim() && (
                        <div className="max-h-36 overflow-y-auto space-y-1 bg-white p-1.5 rounded-xl border border-indigo-200 shadow-sm">
                          {filteredStudentsForSelect.length === 0 ? (
                            <p className="text-[11px] text-slate-500 p-2 text-center">Koi student match nahi hua</p>
                          ) : (
                            filteredStudentsForSelect.slice(0, 8).map((s) => (
                              <button
                                type="button"
                                key={s.id}
                                onClick={() => {
                                  handleSelectStudent(s.id);
                                  setStudentSearchQuery(`${s.firstName} ${s.lastName || ''}`.trim());
                                }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 flex items-center justify-between transition-colors border border-transparent hover:border-indigo-100"
                              >
                                <span className="font-bold text-slate-800">
                                  {s.firstName} {s.lastName || ''}
                                </span>
                                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                                  {s.className || 'Class 4'} • Roll {s.rollNumber || s.rollNo || '01'} • {s.admissionNo}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      {/* Dropdown fallback selector */}
                      <select
                        value={formData.studentId}
                        onChange={(e) => handleSelectStudent(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-semibold text-slate-700 mt-1"
                      >
                        <option value="">-- Ya Dropdown List Se Select Karein --</option>
                        {studentsList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.firstName} {s.lastName || ''} ({s.className || 'Class 4'} • Roll {s.rollNumber || s.rollNo || '01'} • Adm {s.admissionNo})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-teal-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Class / Section *</label>
                      <select
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                      >
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Roll Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 01"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Fee Term (Quarter) *</label>
                      <select
                        value={formData.term}
                        onChange={(e) => {
                          const newTerm = e.target.value;
                          const termObj = CBSE_FEE_TERMS.find((t) => t.id === newTerm);
                          const firstMonth = termObj?.months?.[1] || termObj?.months?.[0] || 'April 2026';
                          setFormData({ ...formData, term: newTerm, month: firstMonth });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                      >
                        {CBSE_FEE_TERMS.filter((t) => t.id !== 'ALL').map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label} ({t.period})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Choose Month(s) Submitted *</label>
                      <select
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-xs font-bold text-indigo-900 bg-white"
                      >
                        {(CBSE_FEE_TERMS.find((t) => t.id === formData.term)?.months || []).map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Manual Amount Inputs */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-800">Fee Particulars & Manual Amounts (₹)</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, amountPaid: formData.totalAmount })}
                          className="px-2 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold"
                        >
                          Quick No Due (Full Paid)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, amountPaid: String(Math.floor(curTotal / 2)) })}
                          className="px-2 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold"
                        >
                          50% Partial
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">
                          Total Fee Amount (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={formData.totalAmount}
                          onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">
                          Amount Paid Now (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          max={curTotal}
                          value={formData.amountPaid}
                          onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-teal-700 bg-white"
                        />
                      </div>
                    </div>

                    {/* Automatic Balance & No Due Live Indicator */}
                    <div className="pt-2">
                      {isNoDue && (
                        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                            <div>
                              <p className="font-extrabold text-xs">✓ NO DUE • FULL PAYMENT CLEARED</p>
                              <p className="text-[10px] text-emerald-800">Remaining Balance: ₹0. Official "NO DUE" stamp will be affixed.</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px]">
                            NO DUE
                          </span>
                        </div>
                      )}

                      {isPartial && (
                        <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                            <div>
                              <p className="font-extrabold text-xs">⚠ PARTIAL PAYMENT • PENDING DUES: ₹{curBalance}</p>
                              <p className="text-[10px] text-amber-800">Amount Paid: ₹{curPaid} • Outstanding Balance: ₹{curBalance}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                            DUE ₹{curBalance}
                          </span>
                        </div>
                      )}

                      {isUnpaid && (
                        <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                            <div>
                              <p className="font-extrabold text-xs">UNPAID INVOICE • FULL DUE: ₹{curBalance}</p>
                              <p className="text-[10px] text-rose-800">No payment collected yet. Invoice will be recorded as pending.</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 font-black text-[10px]">
                            UNPAID
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                      <select
                        value={formData.paymentMode}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                      >
                        <option value="CASH">Cash Counter (At School Desk)</option>
                        <option value="UPI">School UPI / QR Code</option>
                        <option value="ONLINE_RAZORPAY">Online Razorpay Gateway</option>
                        <option value="BANK_TRANSFER">Direct Bank NEFT / IMPS</option>
                        <option value="CHEQUE">Bank Cheque / DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Fee Description / Remarks</label>
                      <input
                        type="text"
                        placeholder={isNoDue ? 'No Due - Full Fee Cleared' : `Partial Fee, Due: ₹${curBalance}`}
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 flex items-center space-x-1.5 transition-all"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>{processing ? 'Generating...' : 'Auto Create & Print Receipt'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODAL 2: OFFICIAL CBSE FEE RECEIPT (PRINTABLE / DOWNLOAD) */}
          {/* ======================================================== */}
          {activeReceiptModal && (
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 text-slate-800 my-6 relative">
                {/* Print Control Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Verified Official Receipt</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      onClick={() => setActiveReceiptModal(null)}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* RECEIPT PAPER CONTAINER (CBSE STANDARD FORMAT) */}
                <div className="border-2 border-slate-800 p-6 rounded-2xl bg-white shadow-xs space-y-5 print:border-none print:p-0">
                  {/* School Header */}
                  <div className="text-center pb-3 border-b-2 border-slate-800">
                    <div className="flex items-center justify-center space-x-3 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo.png" alt="A. P. Public School Crest" className="w-14 h-14 object-contain rounded-xl border border-slate-200 shadow-sm" />
                      <div className="text-left">
                        <h1 className="text-xl font-black tracking-wide text-slate-950 uppercase leading-tight">
                          A. P. PUBLIC SCHOOL
                        </h1>
                        <p className="text-[11px] font-bold text-slate-600">Baruasagar, Jhansi (U.P.) – CBSE Affiliated</p>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 mt-1">
                      Affiliation No: 2130000 • School Code: 71234 • Est. 2005
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Baruasagar Road, Jhansi (U.P.) - 284003 • Tel: +91-7309720610
                    </p>
                    <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold uppercase tracking-widest">
                      FEE PAYMENT RECEIPT & CLEARANCE CERTIFICATE
                    </div>
                  </div>

                  {/* Receipt Meta & Student Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="text-slate-500">
                        Receipt No: <strong className="font-mono text-slate-900">{activeReceiptModal.receiptNo || activeReceiptModal.invoiceNo}</strong>
                      </p>
                      <p className="text-slate-500">
                        Invoice Ref: <strong className="font-mono text-slate-900">{activeReceiptModal.invoiceNo}</strong>
                      </p>
                      <p className="text-slate-500">
                        Payment Date: <strong className="text-slate-900">{activeReceiptModal.createdAt || '2026-11-18'}</strong>
                      </p>
                      <p className="text-slate-500">
                        Academic Term: <strong className="text-indigo-950 font-bold">{resolveFeeTerm(activeReceiptModal.term || activeReceiptModal.month).label}</strong>
                      </p>
                      <p className="text-slate-500">
                        Submitted Month: <strong className="text-teal-950 font-bold">{activeReceiptModal.month || 'April 2026'}</strong>
                      </p>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="text-slate-500">
                        Student Name: <strong className="text-slate-900 text-sm">{activeReceiptModal.studentName}</strong>
                      </p>
                      <p className="text-slate-500">
                        Class & Section: <strong className="text-slate-900">{activeReceiptModal.class}</strong>
                      </p>
                      <p className="text-slate-500">
                        Roll Number: <strong className="text-slate-900">{activeReceiptModal.rollNo || '01'}</strong>
                      </p>
                      <p className="text-slate-500">
                        Admission No: <strong className="font-mono text-slate-900">{activeReceiptModal.admissionNo || 'APPS/2026/01'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Fee Items Table */}
                  <div className="overflow-hidden rounded-xl border border-slate-300">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase font-bold">
                        <tr>
                          <th className="py-2.5 px-3">S.No</th>
                          <th className="py-2.5 px-3">Fee Particulars</th>
                          <th className="py-2.5 px-3">Fee Term</th>
                          <th className="py-2.5 px-3">Month(s) Covered</th>
                          <th className="py-2.5 px-3 text-right">Total Dues</th>
                          <th className="py-2.5 px-3 text-right">Amount Paid</th>
                          <th className="py-2.5 px-3 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="py-3 px-3 font-bold text-slate-600">1</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{activeReceiptModal.feeHead || 'Tuition Fee'}</span>
                            <span className="text-[10px] text-slate-500">{activeReceiptModal.remarks || 'Standard Academic Dues'}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-indigo-900 block">{resolveFeeTerm(activeReceiptModal.term || activeReceiptModal.month).shortLabel}</span>
                            <span className="text-[10px] text-slate-500">{resolveFeeTerm(activeReceiptModal.term || activeReceiptModal.month).period}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">{activeReceiptModal.month || 'April 2026'}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">₹{activeReceiptModal.total}</td>
                          <td className="py-3 px-3 text-right font-bold text-teal-700">₹{activeReceiptModal.paid}</td>
                          <td className="py-3 px-3 text-right font-bold text-rose-600">
                            {activeReceiptModal.balance === 0 ? '₹0' : `₹${activeReceiptModal.balance}`}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-800">
                        <tr>
                          <td colSpan={5} className="py-2.5 px-3 text-right text-slate-700">
                            NET AMOUNT RECEIVED:
                          </td>
                          <td className="py-2.5 px-3 text-right text-sm text-teal-800 font-black">
                            ₹{activeReceiptModal.paid}
                          </td>
                          <td className="py-2.5 px-3 text-right text-sm text-rose-600 font-black">
                            ₹{activeReceiptModal.balance}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Amount in words & Payment Mode */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-600">
                      Amount in Words: <strong className="text-slate-900 italic">{numberToWords(activeReceiptModal.paid)}</strong>
                    </p>
                    <p className="text-slate-600">
                      Payment Mode: <strong className="text-slate-900">{activeReceiptModal.paymentMode || 'CASH'}</strong> • Clearance Status: <strong className="text-slate-900">{activeReceiptModal.balance === 0 ? 'Fully Cleared' : 'Partial Deposit'}</strong>
                    </p>
                  </div>

                  {/* Prominent NO DUE or Balance Stamp */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    {activeReceiptModal.balance === 0 ? (
                      <div className="p-3 px-5 rounded-2xl border-2 border-dashed border-emerald-600 bg-emerald-50 text-emerald-950 flex items-center space-x-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-sm font-black tracking-wider text-emerald-800 uppercase">
                            ✓ NO DUE / ALL CLEAR
                          </p>
                          <p className="text-[10px] font-semibold text-emerald-700">
                            Zero outstanding balance. All fees cleared for this fee period.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 px-5 rounded-2xl border-2 border-dashed border-amber-600 bg-amber-50 text-amber-950 flex items-center space-x-3">
                        <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
                        <div>
                          <p className="text-sm font-black tracking-wider text-amber-800 uppercase">
                            ⚠ PARTIAL PAYMENT • DUE: ₹{activeReceiptModal.balance}
                          </p>
                          <p className="text-[10px] font-semibold text-amber-700">
                            Balance amount of ₹{activeReceiptModal.balance} remains pending.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Official Signatures */}
                    <div className="flex items-end space-x-8 text-center text-[10px] font-bold text-slate-700">
                      <div>
                        <div className="w-24 border-b border-slate-400 mb-1" />
                        <span>Depositor Signature</span>
                      </div>
                      <div>
                        <div className="w-28 border-b border-slate-400 mb-1" />
                        <span>Cashier / Accounts Officer</span>
                      </div>
                      <div>
                        <div className="w-28 border-b-2 border-slate-900 mb-1 flex items-center justify-center text-teal-800">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-teal-600" />
                          <span className="text-[9px] uppercase tracking-tighter">Verified</span>
                        </div>
                        <span>Principal / Seal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 flex justify-end space-x-2 print:hidden">
                  <button
                    onClick={() => setActiveReceiptModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Razorpay Online Payment Modal */}
          {showRazorpayModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Razorpay Secure Checkout</h3>
                  <p className="text-slate-500">A. P PUBLIC SCHOOL, Jhansi</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 mb-4 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student:</span>
                    <span className="font-bold text-slate-800">{showRazorpayModal.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice:</span>
                    <span className="font-mono">{showRazorpayModal.invoiceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Month:</span>
                    <span>{showRazorpayModal.month}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                    <span>Payable:</span>
                    <span className="text-indigo-900">₹{showRazorpayModal.balance}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={confirmRazorpayPayment}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
                  >
                    <span>Authorize Razorpay Payment (₹{showRazorpayModal.balance})</span>
                  </button>
                  <button
                    onClick={() => setShowRazorpayModal(null)}
                    className="w-full py-2 text-slate-500 font-semibold hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Offline Payment Recording Modal */}
          {showOfflineModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs">
                <h3 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b">
                  Record Fee Collection: {showOfflineModal.studentName}
                </h3>

                <form onSubmit={handleOfflinePay} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Fee Term *</label>
                      <select
                        value={offlineTerm}
                        onChange={(e) => {
                          const newTerm = e.target.value;
                          setOfflineTerm(newTerm);
                          const termObj = CBSE_FEE_TERMS.find((t) => t.id === newTerm);
                          setOfflineMonth(termObj?.months?.[1] || termObj?.months?.[0] || 'April 2026');
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      >
                        {CBSE_FEE_TERMS.filter((t) => t.id !== 'ALL').map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.shortLabel}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Fee Month *</label>
                      <select
                        value={offlineMonth}
                        onChange={(e) => setOfflineMonth(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-indigo-300 text-xs font-bold text-indigo-900"
                      >
                        {(CBSE_FEE_TERMS.find((t) => t.id === offlineTerm)?.months || []).map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Payment Mode</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                    >
                      <option value="CASH">Cash at Counter</option>
                      <option value="UPI">School QR / UPI</option>
                      <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                      <option value="CHEQUE">Bank Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Amount Paid (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={showOfflineModal.balance}
                      value={offlineAmount}
                      onChange={(e) => setOfflineAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowOfflineModal(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold"
                    >
                      Save & Issue Receipt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Clear Dues Modal (Principal Direct Fee Collection) */}
          {showClearDuesModal && selectedStudentForDues && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-200 text-xs my-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">Fee Collection & Receipt</h3>
                    <p className="text-[11px] text-slate-500">{selectedStudentForDues.firstName} {selectedStudentForDues.lastName} ({selectedStudentForDues.className})</p>
                  </div>
                  <button onClick={() => setShowClearDuesModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleClearDuesSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Fee Term (Quarter) *</label>
                      <select
                        value={clearDuesTerm}
                        onChange={(e) => {
                          const newTerm = e.target.value;
                          setClearDuesTerm(newTerm);
                          const termObj = CBSE_FEE_TERMS.find((t) => t.id === newTerm);
                          const firstMonth = termObj?.months?.[1] || termObj?.months?.[0] || 'April 2026';
                          setClearDuesMonth(firstMonth);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                      >
                        {CBSE_FEE_TERMS.filter((t) => t.id !== 'ALL').map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label} ({t.period})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Choose Month(s) Submitted *</label>
                      <select
                        value={clearDuesMonth}
                        onChange={(e) => setClearDuesMonth(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-xs font-bold text-indigo-900 bg-white"
                      >
                        {(CBSE_FEE_TERMS.find((t) => t.id === clearDuesTerm)?.months || []).map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Amount Collecting (₹) *</label>
                    <input type="number" required min={1} value={clearDuesAmount}
                      onChange={(e) => setClearDuesAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-sm font-black text-indigo-900 bg-white" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
                    <select value={clearDuesMode} onChange={(e) => setClearDuesMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800">
                      <option value="CASH">Cash at Counter</option>
                      <option value="UPI">School QR / UPI</option>
                      <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                      <option value="CHEQUE">Bank Cheque</option>
                      <option value="ONLINE_RAZORPAY">Razorpay Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Remarks (Optional)</label>
                    <input type="text" value={clearDuesRemarks} onChange={(e) => setClearDuesRemarks(e.target.value)}
                      placeholder="e.g. Full April fee paid by father" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800" />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button type="button" onClick={() => setShowClearDuesModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                    <button type="submit" disabled={processing} className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md flex items-center space-x-1.5">
                      <Receipt className="w-4 h-4" />
                      <span>{processing ? 'Processing...' : 'Submit & Generate Receipt'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
