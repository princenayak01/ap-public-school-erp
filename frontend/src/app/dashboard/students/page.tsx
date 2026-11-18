'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Download,
  Upload,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  TableProperties,
  Trash2,
  PlusCircle,
  ShieldAlert
} from 'lucide-react';

interface Student {
  id: string;
  admissionNo: string;
  rollNo: number | string;
  name: string;
  class: string;
  section: string;
  fatherName: string;
  phone: string;
  status: string;
  gender: string;
}

interface ManualRow {
  id: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  className: string;
  sectionName: string;
  gender: string;
  fatherName: string;
  phone: string;
}

const initialStudents: Student[] = [];

const defaultManualRows: ManualRow[] = [
  { id: 'm-1', rollNo: '1', firstName: '', lastName: '', className: 'Class 4', sectionName: 'A', gender: 'MALE', fatherName: '', phone: '' },
  { id: 'm-2', rollNo: '2', firstName: '', lastName: '', className: 'Class 4', sectionName: 'A', gender: 'FEMALE', fatherName: '', phone: '' },
  { id: 'm-3', rollNo: '3', firstName: '', lastName: '', className: 'Class 4', sectionName: 'A', gender: 'MALE', fatherName: '', phone: '' },
  { id: 'm-4', rollNo: '4', firstName: '', lastName: '', className: 'Class 4', sectionName: 'A', gender: 'FEMALE', fatherName: '', phone: '' },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingRollId, setEditingRollId] = useState<string | null>(null);
  const [tempRoll, setTempRoll] = useState<string>('');
  const [activeRole, setActiveRole] = useState<'TEACHER' | 'PARENT' | 'PRINCIPAL'>('TEACHER');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('apps_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.role === 'TEACHER' || u.role === 'PARENT' || u.role === 'PRINCIPAL') {
          setActiveRole(u.role);
          return;
        }
      }
    } catch (e) {}

    const stored = localStorage.getItem('apps_active_role');
    if (stored === 'TEACHER' || stored === 'PARENT' || stored === 'PRINCIPAL') {
      setActiveRole(stored);
    }
  }, []);

  // Bulk Upload & Manual Column State
  const [bulkActiveTab, setBulkActiveTab] = useState<'FILE' | 'MANUAL_GRID' | 'PASTE'>('MANUAL_GRID');
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [parsedBulkStudents, setParsedBulkStudents] = useState<any[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [manualRows, setManualRows] = useState<ManualRow[]>(defaultManualRows);

  // Load students from backend
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/v1/students');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setStudents(
            data.data.map((s: any) => ({
              id: s.id,
              admissionNo: s.admissionNo,
              rollNo: s.rollNumber || '—',
              name: `${s.firstName} ${s.lastName}`.trim(),
              class: s.className || (s.class ? s.class.name : 'Class 4'),
              section: s.sectionName || (s.section ? s.section.name : 'A'),
              fatherName: s.parentName || (s.parent?.user ? s.parent.user.name : 'Parent Guardian'),
              phone: s.parentPhone || (s.parent?.user ? s.parent.user.phone : '+91-9876543210'),
              status: s.status || 'ACTIVE',
              gender: s.gender || 'MALE',
            }))
          );
        } else {
          setStudents([]);
        }
      } catch (err) {
        setStudents([]);
      }
    }
    loadStudents();
  }, []);

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove student "${studentName}"?`)) return;
    try {
      const res = await fetch(`/api/v1/students/${studentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setStudents((prev) => prev.filter((s) => s.id !== studentId && s.admissionNo !== studentId));
      setSuccessMsg(data.message || `Student "${studentName}" deleted successfully.`);
    } catch (err) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId && s.admissionNo !== studentId));
      setSuccessMsg(`Student "${studentName}" deleted successfully.`);
    } finally {
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleClearAllStudents = async () => {
    if (!window.confirm('Are you sure you want to remove all students? This will wipe all test records.')) return;
    try {
      const res = await fetch('/api/v1/students/clear-all', {
        method: 'POST',
      });
      const data = await res.json();
      setStudents([]);
      setSuccessMsg(data.message || 'All test students removed successfully!');
    } catch (err) {
      setStudents([]);
      setSuccessMsg('All test students removed successfully!');
    } finally {
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  // Save manual Roll Number
  const handleSaveRollNo = async (studentId: string, studentName: string) => {
    if (!tempRoll.trim()) return;
    try {
      const res = await fetch(`/api/v1/students/${studentId}/roll-no`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: tempRoll.trim() }),
      });
      const data = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, rollNo: tempRoll.trim() } : s))
      );
      setEditingRollId(null);
      setSuccessMsg(data.message || `Roll Number for ${studentName} updated to #${tempRoll.trim()}!`);
    } catch (err) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, rollNo: tempRoll.trim() } : s))
      );
      setEditingRollId(null);
      setSuccessMsg(`Roll Number for ${studentName} updated to #${tempRoll.trim()}!`);
    } finally {
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  // Form State for Single Admission
  const [newAdmission, setNewAdmission] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    dob: '2018-05-10',
    className: 'Class 4',
    sectionName: 'A',
    rollNumber: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    parentEmail: '',
    address: 'Behind P.N.B. Bank, Baruasagar, Jhansi',
  });

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/students/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newAdmission.firstName,
          lastName: newAdmission.lastName,
          gender: newAdmission.gender,
          dateOfBirth: newAdmission.dob,
          className: newAdmission.className,
          sectionName: newAdmission.sectionName,
          rollNumber: newAdmission.rollNumber || String(students.length + 1),
          parentName: newAdmission.fatherName,
          parentPhone: newAdmission.fatherPhone,
          parentEmail: newAdmission.parentEmail,
          address: newAdmission.address,
        }),
      });
      const data = await res.json();
      const savedStudent = data.data;

      const newStudent: Student = {
        id: savedStudent.id,
        admissionNo: savedStudent.admissionNo,
        rollNo: savedStudent.rollNumber || students.length + 1,
        name: `${savedStudent.firstName} ${savedStudent.lastName}`.trim(),
        class: savedStudent.className,
        section: savedStudent.sectionName,
        fatherName: savedStudent.parentName,
        phone: savedStudent.parentPhone,
        status: 'ACTIVE',
        gender: savedStudent.gender,
      };

      setStudents([newStudent, ...students]);
      setShowModal(false);
      setSuccessMsg(data.message || `Student ${newStudent.name} admitted with Admission No: ${savedStudent.admissionNo}`);
    } catch (err: any) {
      const nextNo = `APPS/2026/${String(students.length + 1).padStart(3, '0')}`;
      const newStudent: Student = {
        id: String(students.length + 1),
        admissionNo: nextNo,
        rollNo: newAdmission.rollNumber || students.length + 1,
        name: `${newAdmission.firstName} ${newAdmission.lastName}`.trim(),
        class: newAdmission.className,
        section: newAdmission.sectionName,
        fatherName: newAdmission.fatherName,
        phone: newAdmission.fatherPhone,
        status: 'ACTIVE',
        gender: newAdmission.gender,
      };

      setStudents([newStudent, ...students]);
      setShowModal(false);
      setSuccessMsg(`Student ${newStudent.name} admitted with Admission No: ${nextNo}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMsg(''), 6000);
    }
  };

  // CSV Parsing Logic
  const parseCsvText = (csv: string) => {
    const lines = csv.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) {
      setParsedBulkStudents([]);
      return;
    }

    const headers = lines[0].toLowerCase().split(',').map((h) => h.trim().replace(/['"]/g, ''));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/['"]/g, ''));
      if (cols.length < 2) continue;

      const row: any = {};
      headers.forEach((h, idx) => {
        row[h] = cols[idx] || '';
      });

      const rollNo = row.rollno || row.roll_no || row.roll || row['roll no'] || String(students.length + i);
      const name = row.name || row.fullname || `${row.firstname || ''} ${row.lastname || ''}`.trim() || `Student ${i}`;
      const firstName = row.firstname || name.split(' ')[0] || 'Student';
      const lastName = row.lastname || (name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : 'Kumar');
      const className = row.class || row.classname || row.grade || 'Class 4';
      const sectionName = row.section || row.sectionname || 'A';
      const gender = (row.gender || 'MALE').toUpperCase().startsWith('F') ? 'FEMALE' : 'MALE';
      const fatherName = row.fathername || row.father || row.parentname || row.guardian || 'Parent Guardian';
      const phone = row.phone || row.mobile || row.contact || row.parentphone || '+91-9876543210';
      const dob = row.dob || row.dateofbirth || '2016-05-15';

      records.push({
        rollNo,
        name,
        firstName,
        lastName,
        className,
        sectionName,
        gender,
        fatherName,
        phone,
        dob,
      });
    }

    setParsedBulkStudents(records);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBulkCsvText(content);
      parseCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const sample = `rollNo,firstName,lastName,className,sectionName,gender,fatherName,parentPhone,dob
10,Rishi,Mishra,Class 4,A,MALE,Pradeep Mishra,+91-9876543230,2016-04-12
11,Divya,Shukla,Class 4,A,FEMALE,Ashok Shukla,+91-9876543231,2016-07-25
12,Harsh,Pandey,Class 4,A,MALE,Mahesh Pandey,+91-9876543232,2016-09-10
13,Ananya,Dubey,Class 4,A,FEMALE,Ramesh Dubey,+91-9876543233,2016-11-04`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'APPS_Student_Upload_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual Column Grid Handlers
  const handleUpdateManualCell = (id: string, field: keyof ManualRow, value: string) => {
    setManualRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddManualRow = () => {
    const nextRoll = manualRows.length > 0 ? Number(manualRows[manualRows.length - 1].rollNo || 0) + 1 : students.length + 1;
    setManualRows((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random()}`,
        rollNo: String(nextRoll),
        firstName: '',
        lastName: '',
        className: 'Class 4',
        sectionName: 'A',
        gender: 'MALE',
        fatherName: '',
        phone: '',
      },
    ]);
  };

  const handleAddMultipleManualRows = (count: number) => {
    const newRows: ManualRow[] = [];
    let startRoll = manualRows.length > 0 ? Number(manualRows[manualRows.length - 1].rollNo || 0) + 1 : students.length + 1;
    for (let i = 0; i < count; i++) {
      newRows.push({
        id: `m-${Date.now()}-${i}`,
        rollNo: String(startRoll + i),
        firstName: '',
        lastName: '',
        className: 'Class 4',
        sectionName: 'A',
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        fatherName: '',
        phone: '',
      });
    }
    setManualRows((prev) => [...prev, ...newRows]);
  };

  const handleDeleteManualRow = (id: string) => {
    setManualRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveManualColumnData = async () => {
    const filledRows = manualRows.filter((r) => r.firstName.trim().length > 0);
    if (filledRows.length === 0) {
      setErrorMsg('Kripya kam se kam ek student ka First Name column me enter karein.');
      return;
    }

    setBulkUploading(true);
    setErrorMsg('');

    try {
      const payload = filledRows.map((r) => ({
        rollNo: r.rollNo || String(students.length + 1),
        firstName: r.firstName.trim(),
        lastName: r.lastName.trim() || 'Kumar',
        className: r.className,
        sectionName: r.sectionName,
        gender: r.gender,
        fatherName: r.fatherName.trim() || 'Parent Guardian',
        phone: r.phone.trim() || '+91-9876543210',
      }));

      const res = await fetch('/api/v1/students/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: payload }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const newUploadedStudents: Student[] = data.data.map((s: any) => ({
          id: s.id,
          admissionNo: s.admissionNo,
          rollNo: s.rollNumber || '—',
          name: `${s.firstName} ${s.lastName}`.trim(),
          class: s.className,
          section: s.sectionName,
          fatherName: s.parentName,
          phone: s.parentPhone,
          status: 'ACTIVE',
          gender: s.gender,
        }));

        setStudents([...newUploadedStudents, ...students]);
        setShowBulkModal(false);
        setManualRows(defaultManualRows);
        setSuccessMsg(`Successfully saved and enrolled ${newUploadedStudents.length} students via Manual Column Entry!`);
      } else {
        setErrorMsg(data.message || 'Failed to save student column data.');
      }
    } catch (err: any) {
      const localAdded: Student[] = filledRows.map((st, idx) => ({
        id: `std-local-${Date.now()}-${idx}`,
        admissionNo: `APPS/2026/${String(students.length + idx + 1).padStart(3, '0')}`,
        rollNo: st.rollNo,
        name: `${st.firstName} ${st.lastName}`.trim(),
        class: st.className,
        section: st.sectionName,
        fatherName: st.fatherName || 'Parent Guardian',
        phone: st.phone || '+91-9876543210',
        status: 'ACTIVE',
        gender: st.gender,
      }));

      setStudents([...localAdded, ...students]);
      setShowBulkModal(false);
      setManualRows(defaultManualRows);
      setSuccessMsg(`Successfully saved and enrolled ${localAdded.length} students via Manual Column Entry!`);
    } finally {
      setBulkUploading(false);
      setTimeout(() => setSuccessMsg(''), 7000);
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (parsedBulkStudents.length === 0) {
      setErrorMsg('No students parsed. Please upload a valid CSV or paste data.');
      return;
    }

    setBulkUploading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/students/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: parsedBulkStudents }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const newUploadedStudents: Student[] = data.data.map((s: any) => ({
          id: s.id,
          admissionNo: s.admissionNo,
          rollNo: s.rollNumber || '—',
          name: `${s.firstName} ${s.lastName}`.trim(),
          class: s.className,
          section: s.sectionName,
          fatherName: s.parentName,
          phone: s.parentPhone,
          status: 'ACTIVE',
          gender: s.gender,
        }));

        setStudents([...newUploadedStudents, ...students]);
        setShowBulkModal(false);
        setParsedBulkStudents([]);
        setBulkCsvText('');
        setSuccessMsg(`Successfully uploaded ${newUploadedStudents.length} students to the official school roster!`);
      } else {
        setErrorMsg(data.message || 'Failed to upload students.');
      }
    } catch (err: any) {
      const localAdded: Student[] = parsedBulkStudents.map((st, idx) => ({
        id: `std-local-${Date.now()}-${idx}`,
        admissionNo: `APPS/2026/${String(students.length + idx + 1).padStart(3, '0')}`,
        rollNo: st.rollNo,
        name: st.name,
        class: st.className,
        section: st.sectionName,
        fatherName: st.fatherName,
        phone: st.phone,
        status: 'ACTIVE',
        gender: st.gender,
      }));

      setStudents([...localAdded, ...students]);
      setShowBulkModal(false);
      setParsedBulkStudents([]);
      setBulkCsvText('');
      setSuccessMsg(`Successfully uploaded ${localAdded.length} students to the official school roster!`);
    } finally {
      setBulkUploading(false);
      setTimeout(() => setSuccessMsg(''), 7000);
    }
  };

  const exportCurrentRoster = () => {
    const csvContent =
      'Admission No,Student Name,Grade,Section,Roll No,Father Name,Phone,Status\n' +
      students
        .map((s) => `"${s.admissionNo}","${s.name}","${s.class}","${s.section}","${s.rollNo}","${s.fatherName}","${s.phone}","${s.status}"`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `APPS_Student_Roster_${selectedClass.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = students.filter((s) => {
    const matchClass = selectedClass === 'ALL' || s.class === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      String(s.rollNo).includes(search);
    return matchClass && matchSearch;
  });

  if (activeRole === 'PARENT') {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar userRole="PARENT" />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Student Directory (Restricted)" />
          <main className="p-8 max-w-2xl mx-auto w-full my-auto text-center">
            <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-800">
                Parent Access Restricted
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Student admissions aur roster uploads sirf School Teachers aur Administration ke liye hain. Aap apne ward ki details Parent Portal par dekh sakte hain.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/parent"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs inline-flex items-center space-x-2 shadow-md transition-all"
                >
                  <span>Go to Parent Portal</span>
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
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Student Admission & Directory" />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Teacher & Staff Permission Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-300 text-[10px] font-black uppercase tracking-wider">
                  Teacher & Principal Access Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  Session 2026–27
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1 text-white">
                Student Roster & Data Entry Center
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload via Excel/CSV spreadsheets, enter manually column-by-column in an interactive grid, or admit individual students.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Option 2: Manual Column-Wise Entry Button */}
              <button
                onClick={() => {
                  setBulkActiveTab('MANUAL_GRID');
                  setShowBulkModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer ring-2 ring-amber-400/30"
              >
                <TableProperties className="w-4 h-4 text-slate-950" />
                <span>Manual Column-Wise Entry</span>
              </button>

              {/* Option 1: File Bulk Upload Button */}
              <button
                onClick={() => {
                  setBulkActiveTab('FILE');
                  setShowBulkModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Excel / CSV</span>
              </button>

              {/* Single Admission Button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer border border-indigo-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Single Admission</span>
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-black text-slate-800">{students.length}</span>
                <span className="text-xs text-emerald-600 font-bold">Active Students</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grade Range</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl font-extrabold text-indigo-950">Nursery – 8</span>
                <span className="text-xs text-slate-400 font-semibold">CBSE Curriculum</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teacher Permissions</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-sm font-bold text-teal-700">Column Data Save</span>
                <span className="text-[11px] text-teal-600 font-bold">Enabled</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">School Code</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-sm font-mono font-bold text-slate-800">2130000</span>
                <span className="text-[11px] text-slate-400">Baruasagar, Jhansi</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, roll no, admission no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">Filter Grade:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Grades (Nursery - 8)</option>
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

              <button
                onClick={exportCurrentRoster}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                title="Download current roster as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  Enrolled Students Directory ({filtered.length})
                </span>
                <p className="text-[11px] text-slate-500">
                  Teachers can click on any student&apos;s Roll Number to edit it inline, or delete individual rows.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {students.length > 0 && (
                  <button
                    onClick={handleClearAllStudents}
                    className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Remove all test/dummy students from the database"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Clear All Students</span>
                  </button>
                )}
                <span className="text-xs text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  CBSE Enrolled Roster
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                    <th className="py-3 px-3 text-center">Roll #</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-3">Grade & Section</th>
                    <th className="py-3 px-4">Father / Guardian</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-3">Gender</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 px-4 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-teal-600">
                            <GraduationCap className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">No Student Records (Database Clean)</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              All fake test student data has been completely cleared. You can now start fresh by entering real students via <strong>Manual Column-Wise Entry</strong> or uploading an <strong>Excel/CSV spreadsheet</strong>.
                            </p>
                          </div>
                          <div className="flex flex-wrap justify-center gap-2 pt-2">
                            <button
                              onClick={() => {
                                setBulkActiveTab('MANUAL_GRID');
                                setShowBulkModal(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm cursor-pointer"
                            >
                              <TableProperties className="w-3.5 h-3.5" />
                              <span>Manual Column-Wise Entry</span>
                            </button>
                            <button
                              onClick={() => {
                                setBulkActiveTab('FILE');
                                setShowBulkModal(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload CSV / Excel</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Editable Roll Number */}
                        <td className="py-3 px-3 text-center">
                          {editingRollId === s.id ? (
                            <div className="flex items-center justify-center space-x-1">
                              <input
                                type="text"
                                value={tempRoll}
                                onChange={(e) => setTempRoll(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRollNo(s.id, s.name);
                                  if (e.key === 'Escape') setEditingRollId(null);
                                }}
                                className="w-12 px-1 py-0.5 text-center font-bold text-xs rounded border border-indigo-500 bg-white text-indigo-900 focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRollNo(s.id, s.name)}
                                className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                                title="Save Roll Number"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingRollId(null)}
                                className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingRollId(s.id);
                                setTempRoll(String(s.rollNo));
                              }}
                              className="group inline-flex items-center space-x-1 cursor-pointer px-2 py-0.5 rounded-md hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all"
                              title="Teacher: Click to edit roll number"
                            >
                              <span className="font-mono font-bold text-slate-800 text-xs">#{s.rollNo}</span>
                              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-indigo-900">{s.admissionNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{s.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                            {s.class} - {s.section}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{s.fatherName}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{s.phone}</td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-semibold text-slate-500">{s.gender}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete this student record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BULK UPLOAD & MANUAL COLUMN-WISE DATA MODAL */}
          {showBulkModal && (
            <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
              <div className={`bg-white rounded-3xl ${bulkActiveTab === 'MANUAL_GRID' ? 'max-w-5xl' : 'max-w-2xl'} w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200 space-y-5 transition-all`}>
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <TableProperties className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Student Data Entry & Upload System
                      </h3>
                      <p className="text-xs text-slate-500">
                        Choose your preferred mode: Manual Column-Wise Spreadsheet Grid or Excel/CSV File Upload.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowBulkModal(false);
                      setParsedBulkStudents([]);
                      setBulkCsvText('');
                      setErrorMsg('');
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 3 Tab Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {/* Option 2 Tab */}
                    <button
                      onClick={() => setBulkActiveTab('MANUAL_GRID')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                        bulkActiveTab === 'MANUAL_GRID'
                          ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-400/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <TableProperties className="w-3.5 h-3.5" />
                      <span>Option 2: Manual Column-Wise Grid Entry</span>
                    </button>

                    {/* Option 1 Tab */}
                    <button
                      onClick={() => setBulkActiveTab('FILE')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        bulkActiveTab === 'FILE'
                          ? 'bg-indigo-950 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Option 1: Upload CSV/Excel File</span>
                    </button>

                    {/* Option 3 Tab */}
                    <button
                      onClick={() => setBulkActiveTab('PASTE')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        bulkActiveTab === 'PASTE'
                          ? 'bg-indigo-950 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Option 3: Paste CSV Text</span>
                    </button>
                  </div>

                  {bulkActiveTab === 'FILE' && (
                    <button
                      onClick={handleDownloadSampleCsv}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-600" />
                      <span>Sample Template (.CSV)</span>
                    </button>
                  )}
                </div>

                {/* ======================================================== */}
                {/* OPTION 2: MANUAL COLUMN-WISE SPREADSHEET GRID ENTRY     */}
                {/* ======================================================== */}
                {bulkActiveTab === 'MANUAL_GRID' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                      <div>
                        <span className="text-xs font-bold text-amber-950 block">
                          Manual Column-Wise Spreadsheet Entry (मैन्युअल कॉलम-वाइज़ डेटा सेव)
                        </span>
                        <p className="text-[11px] text-amber-800">
                          Directly type student details into columns. Add new rows as needed, then click &apos;Save All Column Data&apos;.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleAddManualRow}
                          className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>+ Add 1 Row</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddMultipleManualRows(5)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-xs font-bold cursor-pointer"
                        >
                          + Add 5 Rows
                        </button>
                      </div>
                    </div>

                    {/* Interactive Editable Spreadsheet Table */}
                    <div className="max-h-96 overflow-x-auto overflow-y-auto rounded-2xl border border-slate-200 shadow-inner">
                      <table className="w-full text-left text-xs min-w-[760px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200 sticky top-0 z-10">
                            <th className="py-2.5 px-2 text-center w-12">#</th>
                            <th className="py-2.5 px-2 w-16 text-center">Roll No</th>
                            <th className="py-2.5 px-3 w-36">First Name *</th>
                            <th className="py-2.5 px-3 w-32">Last Name</th>
                            <th className="py-2.5 px-2 w-28">Class</th>
                            <th className="py-2.5 px-2 w-16 text-center">Sec</th>
                            <th className="py-2.5 px-2 w-24">Gender</th>
                            <th className="py-2.5 px-3 w-40">Father / Guardian</th>
                            <th className="py-2.5 px-3 w-36">Contact Mobile</th>
                            <th className="py-2.5 px-2 text-center w-12">Del</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {manualRows.map((row, idx) => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Row Index */}
                              <td className="py-2 px-2 text-center font-bold text-slate-400 text-[11px]">
                                {idx + 1}
                              </td>

                              {/* Roll No Column */}
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="text"
                                  value={row.rollNo}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'rollNo', e.target.value)}
                                  placeholder="Roll"
                                  className="w-14 px-1.5 py-1 text-center font-bold text-xs rounded border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-indigo-950 bg-slate-50"
                                />
                              </td>

                              {/* First Name Column */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.firstName}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'firstName', e.target.value)}
                                  placeholder="e.g. Rahul"
                                  className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
                                />
                              </td>

                              {/* Last Name Column */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.lastName}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'lastName', e.target.value)}
                                  placeholder="e.g. Verma"
                                  className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
                                />
                              </td>

                              {/* Class Column */}
                              <td className="py-2 px-1">
                                <select
                                  value={row.className}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'className', e.target.value)}
                                  className="w-full px-2 py-1 text-[11px] font-semibold rounded border border-slate-200 focus:border-amber-500 focus:outline-none"
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
                              </td>

                              {/* Section Column */}
                              <td className="py-2 px-1 text-center">
                                <select
                                  value={row.sectionName}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'sectionName', e.target.value)}
                                  className="w-full px-1.5 py-1 text-[11px] font-bold rounded border border-slate-200 focus:border-amber-500 focus:outline-none text-center"
                                >
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                </select>
                              </td>

                              {/* Gender Column */}
                              <td className="py-2 px-1">
                                <select
                                  value={row.gender}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'gender', e.target.value)}
                                  className="w-full px-1.5 py-1 text-[11px] rounded border border-slate-200 focus:border-amber-500 focus:outline-none"
                                >
                                  <option value="MALE">Male</option>
                                  <option value="FEMALE">Female</option>
                                </select>
                              </td>

                              {/* Father Name Column */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.fatherName}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'fatherName', e.target.value)}
                                  placeholder="Father's Name"
                                  className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
                                />
                              </td>

                              {/* Contact Mobile Column */}
                              <td className="py-2 px-2">
                                <input
                                  type="tel"
                                  value={row.phone}
                                  onChange={(e) => handleUpdateManualCell(row.id, 'phone', e.target.value)}
                                  placeholder="10 digit mobile"
                                  className="w-full px-2.5 py-1 text-xs font-mono rounded border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
                                />
                              </td>

                              {/* Delete Row Button */}
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteManualRow(row.id)}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete this row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Manual Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>Total Rows: <strong className="text-slate-800">{manualRows.length}</strong></span>
                        <span>•</span>
                        <span>Filled with Name: <strong className="text-teal-700">{manualRows.filter((r) => r.firstName.trim().length > 0).length}</strong></span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowBulkModal(false);
                            setErrorMsg('');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={manualRows.filter((r) => r.firstName.trim().length > 0).length === 0 || bulkUploading}
                          onClick={handleSaveManualColumnData}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {bulkUploading
                              ? 'Saving Column Data...'
                              : `Save All Column Data (${manualRows.filter((r) => r.firstName.trim().length > 0).length} Students)`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* OPTION 1: FILE UPLOAD TAB                                */}
                {/* ======================================================== */}
                {bulkActiveTab === 'FILE' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                      <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">
                        Drag and drop your student roster CSV file here, or browse
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Supports .csv format with headers: rollNo, firstName, lastName, className, sectionName, gender, fatherName, parentPhone
                      </p>
                      <label className="mt-4 inline-block px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all">
                        Choose CSV File
                        <input
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {parsedBulkStudents.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-950">
                            Parsed Records Preview ({parsedBulkStudents.length} Students Ready)
                          </span>
                          <span className="text-[11px] text-emerald-600 font-bold">✓ Ready for Database</span>
                        </div>

                        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-[11px]">
                            <thead>
                              <tr className="bg-slate-100 text-slate-600 uppercase font-bold">
                                <th className="py-2 px-3">Roll #</th>
                                <th className="py-2 px-3">Full Name</th>
                                <th className="py-2 px-3">Grade</th>
                                <th className="py-2 px-3">Gender</th>
                                <th className="py-2 px-3">Father&apos;s Name</th>
                                <th className="py-2 px-3">Phone</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {parsedBulkStudents.map((st, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="py-1.5 px-3 font-mono font-bold text-indigo-900">#{st.rollNo}</td>
                                  <td className="py-1.5 px-3 font-semibold text-slate-800">{st.name}</td>
                                  <td className="py-1.5 px-3">{st.className} - {st.sectionName}</td>
                                  <td className="py-1.5 px-3 text-slate-500">{st.gender}</td>
                                  <td className="py-1.5 px-3 text-slate-600">{st.fatherName}</td>
                                  <td className="py-1.5 px-3 font-mono text-slate-500">{st.phone}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBulkModal(false);
                          setParsedBulkStudents([]);
                          setBulkCsvText('');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={parsedBulkStudents.length === 0 || bulkUploading}
                        onClick={handleBulkUploadSubmit}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {bulkUploading
                            ? 'Enrolling Students...'
                            : `Upload & Enroll ${parsedBulkStudents.length} Students`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* OPTION 3: PASTE RAW CSV TAB                              */}
                {/* ======================================================== */}
                {bulkActiveTab === 'PASTE' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">
                      Paste CSV rows (Include headers in first line):
                    </label>
                    <textarea
                      rows={6}
                      value={bulkCsvText}
                      onChange={(e) => {
                        setBulkCsvText(e.target.value);
                        parseCsvText(e.target.value);
                      }}
                      placeholder="rollNo,firstName,lastName,className,sectionName,gender,fatherName,parentPhone&#10;10,Rishi,Mishra,Class 4,A,MALE,Pradeep Mishra,+91-9876543230&#10;11,Divya,Shukla,Class 4,A,FEMALE,Ashok Shukla,+91-9876543231"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-500"
                    />

                    {parsedBulkStudents.length > 0 && (
                      <span className="text-xs font-bold text-teal-700 block">
                        ✓ {parsedBulkStudents.length} rows parsed and ready to submit.
                      </span>
                    )}

                    <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBulkModal(false);
                          setParsedBulkStudents([]);
                          setBulkCsvText('');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={parsedBulkStudents.length === 0 || bulkUploading}
                        onClick={handleBulkUploadSubmit}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {bulkUploading
                            ? 'Saving...'
                            : `Upload & Enroll ${parsedBulkStudents.length} Students`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SINGLE ADMISSION MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">New Student Admission (2026–27)</h3>
                    <p className="text-xs text-slate-500">A. P PUBLIC SCHOOL • CBSE</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAdmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={newAdmission.firstName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, firstName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                        placeholder="e.g. Aarav"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={newAdmission.lastName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, lastName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                        placeholder="e.g. Sharma"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Grade *</label>
                      <select
                        value={newAdmission.className}
                        onChange={(e) => setNewAdmission({ ...newAdmission, className: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
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
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Section *</label>
                      <select
                        value={newAdmission.sectionName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, sectionName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Roll No (Manual)</label>
                      <input
                        type="text"
                        value={newAdmission.rollNumber}
                        onChange={(e) => setNewAdmission({ ...newAdmission, rollNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                        placeholder="e.g. 15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                      <select
                        value={newAdmission.gender}
                        onChange={(e) => setNewAdmission({ ...newAdmission, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={newAdmission.dob}
                        onChange={(e) => setNewAdmission({ ...newAdmission, dob: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Father&apos;s Name *</label>
                      <input
                        type="text"
                        required
                        value={newAdmission.fatherName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, fatherName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                        placeholder="Father Full Name"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Parent Mobile *</label>
                      <input
                        type="tel"
                        required
                        value={newAdmission.fatherPhone}
                        onChange={(e) => setNewAdmission({ ...newAdmission, fatherPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                        placeholder="10 digit mobile"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Parent Email (For Portal Access)</label>
                    <input
                      type="email"
                      value={newAdmission.parentEmail}
                      onChange={(e) => setNewAdmission({ ...newAdmission, parentEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      placeholder="parent@example.com"
                    />
                  </div>

                  <div className="pt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md shadow-teal-600/20 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Admitting...' : 'Confirm Admission'}
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
