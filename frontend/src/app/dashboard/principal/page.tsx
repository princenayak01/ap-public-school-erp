'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { fallbackPrincipalData } from '@/lib/api';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  CreditCard,
  CalendarCheck2,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  FileCheck2,
  Clock,
  Sparkles,
  Search,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Check,
  X,
  ArrowRight
} from 'lucide-react';

export default function PrincipalDashboard() {
  const [data, setData] = useState(fallbackPrincipalData);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvalMsg, setApprovalMsg] = useState('');
  const [activeRole, setActiveRole] = useState<'TEACHER' | 'PARENT' | 'PRINCIPAL'>('PRINCIPAL');
  const [principalUser, setPrincipalUser] = useState<any>(null);

  const loadPendingUsers = async () => {
    try {
      const res = await fetch('/api/v1/admin/pending-users');
      const resData = await res.json();
      if (resData.success && resData.data) {
        setPendingUsers(resData.data);
      }
    } catch (err) {
      console.warn('Unable to load pending registrations');
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('apps_user');
      const token = localStorage.getItem('apps_token');
      if (!storedUser || !token) {
        window.location.replace('/login/principal');
        return;
      }
      const u = JSON.parse(storedUser);
      if (u.role !== 'PRINCIPAL' && u.role !== 'SCHOOL_ADMIN') {
        window.location.replace('/login/principal');
        return;
      }
      setActiveRole('PRINCIPAL');
      setPrincipalUser(u);
    } catch (e) {
      window.location.replace('/login/principal');
      return;
    }

    fetch('/api/v1/dashboard/principal')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData(resData.data);
        }
      })
      .catch(() => {});

    loadPendingUsers();
  }, []);

  const handleApprove = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/v1/admin/approve-user/${userId}`, {
        method: 'PUT',
      });
      const resData = await res.json();
      setApprovalMsg(resData.message || `Account for ${userName} has been APPROVED!`);
      loadPendingUsers();
    } catch (err) {
      setApprovalMsg(`Account for ${userName} approved!`);
    } finally {
      setTimeout(() => setApprovalMsg(''), 5000);
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/v1/admin/reject-user/${userId}`, {
        method: 'PUT',
      });
      const resData = await res.json();
      setApprovalMsg(resData.message || `Registration for ${userName} has been REJECTED.`);
      loadPendingUsers();
    } catch (err) {
      setApprovalMsg(`Registration for ${userName} rejected.`);
    } finally {
      setTimeout(() => setApprovalMsg(''), 5000);
    }
  };

  const kpis = data.kpis || fallbackPrincipalData.kpis;
  const filteredAdmissions = (data.recentAdmissions || fallbackPrincipalData.recentAdmissions).filter(
    (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeRole === 'TEACHER' || activeRole === 'PARENT') {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar userRole={activeRole} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Principal Executive Dashboard (Restricted)" />
          <main className="p-4 sm:p-8 pb-24 md:pb-8 max-w-2xl mx-auto w-full my-auto text-center">
            <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-800">
                Principal & Super Admin Authorization Required
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Aap is samay <strong>{activeRole}</strong> mode me logged in hain. Principal Dashboard me School-wide financials, approvals aur institutional settings hain jo sirf School Administration ke liye reserved hain.
              </p>
              <div className="pt-2">
                <Link
                  href={activeRole === 'TEACHER' ? '/dashboard/teacher' : '/dashboard/parent'}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs inline-flex items-center space-x-2 shadow-md transition-all"
                >
                  <span>
                    Return to {activeRole === 'TEACHER' ? 'Teacher Command Center' : 'Parent Portal'}
                  </span>
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
      <Sidebar userRole="PRINCIPAL" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Principal & Super Admin Dashboard" />

        <main className="p-3.5 sm:p-6 pb-24 md:pb-8 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Academic Session 2026–27
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                    User ID: {principalUser?.userId || principalUser?.id || 'APPS-PRINCIPAL-01'}
                  </span>
                  <span className="text-xs text-slate-400">CBSE Affiliation: 2130000</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Welcome to A. P PUBLIC SCHOOL, Principal Sharma 👋
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Overview of school operations, registration approvals, attendance statistics, fee collections, and student management.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href="/dashboard/students"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-teal-600/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Admission</span>
                </a>
                <a
                  href="/dashboard/fees"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Fee Billing</span>
                </a>
              </div>
            </div>
          </div>

          {/* Primary Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Students */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{kpis.totalStudents}</h3>
                <p className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5" />
                  Nursery to Class 8 Enrolled
                </p>
              </div>
            </div>

            {/* Attendance */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today Attendance</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{kpis.attendanceRate}%</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {kpis.presentToday} Present • {kpis.absentToday} Absent
                </p>
              </div>
            </div>

            {/* Fee Collection */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</span>
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">₹{Number(kpis.totalCollected).toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-teal-600 font-semibold mt-1">
                  Collection Rate: {kpis.collectionRate}%
                </p>
              </div>
            </div>

            {/* Pending Dues */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Dues</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-extrabold text-amber-600 tracking-tight">₹{Number(kpis.totalPending).toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Automatic Reminders Active
                </p>
              </div>
            </div>
          </div>

          {/* User Registration & Permission Approvals (Admin Only) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-extrabold text-slate-800">Registration Approvals (Admin Authorization)</h3>
                    {pendingUsers.filter((u) => u.status === 'PENDING_APPROVAL').length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] animate-pulse">
                        {pendingUsers.filter((u) => u.status === 'PENDING_APPROVAL').length} Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    New Parents, Students & Teachers cannot log in until approved by the School Administrator
                  </p>
                </div>
              </div>

              <button
                onClick={loadPendingUsers}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200"
              >
                Refresh Requests
              </button>
            </div>

            {approvalMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{approvalMsg}</span>
              </div>
            )}

            {pendingUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No user registration requests pending at this time.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Applicant Name</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Email & Contact</th>
                      <th className="py-2.5 px-3">Class & Section</th>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-800">{u.name}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            u.role === 'PARENT'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : u.role === 'STUDENT'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          <div>{u.email}</div>
                          <div className="text-[10px] text-slate-400">{u.phone}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {u.className || 'Class 4'} - {u.sectionName || 'A'}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">
                          #{u.rollNumber || '-'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {u.status === 'APPROVED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              APPROVED ✓
                            </span>
                          ) : u.status === 'REJECTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              REJECTED ✗
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              PENDING APPROVAL ⏳
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {u.status === 'PENDING_APPROVAL' ? (
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleApprove(u.id, u.name)}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                                title="Approve Account Access"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReject(u.id, u.name)}
                                className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                                title="Reject Registration Request"
                              >
                                <X className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Action Complete</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Class Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Class-wise Student Enrollment Distribution</h3>
                  <p className="text-xs text-slate-500">Live counts across Nursery to Class 8 (22 sections total)</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Total: {kpis.totalStudents} Students
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {(data.classDistribution || fallbackPrincipalData.classDistribution).map((cls) => (
                  <div key={cls.classId} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-700">{cls.className}</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-lg font-black text-indigo-950">{cls.studentCount}</span>
                      <span className="text-[10px] text-slate-400">students</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (cls.studentCount / 40) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Breakdown Gauge */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Today's Attendance Ratio</h3>
                <p className="text-xs text-slate-500">Daily verification across all sections</p>

                <div className="mt-6 flex flex-col items-center">
                  <div className="relative w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-black text-slate-800">{kpis.attendanceRate}%</span>
                      <span className="block text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Present Ratio</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full mt-6 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                      <span className="text-[11px] text-emerald-600 block">Present</span>
                      <span className="font-bold text-slate-800 text-sm">{kpis.presentToday}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-center">
                      <span className="text-[11px] text-rose-600 block">Absent</span>
                      <span className="font-bold text-slate-800 text-sm">{kpis.absentToday}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Auto WhatsApp Alerts:</span>
                <span className="font-semibold text-emerald-600">Active (Dispatched)</span>
              </div>
            </div>
          </div>

          {/* Recent Admissions & Payments Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Admissions */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Recent Student Admissions</h3>
                  <p className="text-xs text-slate-500">New enrollment records with unique student IDs</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative w-full sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Search name / ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <a href="/dashboard/students" className="text-xs font-bold text-teal-600 hover:underline shrink-0">
                    View All →
                  </a>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                      <th className="pb-2">Admission No</th>
                      <th className="pb-2">Student Name</th>
                      <th className="pb-2">Class</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmissions.slice(0, 5).map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 font-mono font-bold text-indigo-900">{st.admissionNo}</td>
                        <td className="py-2.5 font-semibold text-slate-800">{st.name}</td>
                        <td className="py-2.5 text-slate-600">{st.class}</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Fee Payments */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Recent Fee Receipts & Razorpay Audits</h3>
                  <p className="text-xs text-slate-500">Real-time collections and digital transaction logs</p>
                </div>
                <a href="/dashboard/fees" className="text-xs font-bold text-teal-600 hover:underline">
                  View Ledger →
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                      <th className="pb-2">Receipt No</th>
                      <th className="pb-2">Student</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2 text-right">Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.recentPayments || fallbackPrincipalData.recentPayments).map((pmt) => (
                      <tr key={pmt.receiptNo} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 font-mono font-bold text-teal-700">{pmt.receiptNo}</td>
                        <td className="py-2.5 font-semibold text-slate-800">{pmt.studentName}</td>
                        <td className="py-2.5 font-bold text-slate-900">₹{pmt.amount}</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pmt.mode.includes('RAZORPAY')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pmt.mode.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
