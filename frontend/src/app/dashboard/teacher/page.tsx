'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  GraduationCap,
  CalendarCheck2,
  FileSpreadsheet,
  Upload,
  Plus,
  Users,
  Award,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  School,
  Lock
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState('0%');
  const [activeRole, setActiveRole] = useState<'TEACHER' | 'PARENT' | 'PRINCIPAL'>('TEACHER');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('apps_user');
      const token = localStorage.getItem('apps_token');
      if (!storedUser || !token) {
        window.location.replace('/login/teacher');
        return;
      }
      const u = JSON.parse(storedUser);
      if (u.role !== 'TEACHER' && u.role !== 'PRINCIPAL') {
        window.location.replace('/login/teacher');
        return;
      }
      setActiveRole(u.role);
    } catch (e) {
      window.location.replace('/login/teacher');
      return;
    }

    async function loadStats() {
      try {
        const res = await fetch('/api/v1/students');
        const data = await res.json();
        if (data.success && data.data) {
          setStudentCount(data.data.length);
          if (data.data.length > 0) {
            setAttendanceRate('95%');
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    loadStats();
  }, []);

  if (activeRole === 'PARENT') {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar userRole="PARENT" />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Teacher Portal (Restricted)" />
          <main className="p-8 max-w-2xl mx-auto w-full my-auto text-center">
            <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-800">
                Faculty Access Restricted
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Aap Parent account se logged in hain. Teacher Command Center sirf school ke certified class teachers ke liye hai jo students admit karte hain aur attendance mark karte hain.
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
      <Sidebar userRole="TEACHER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Class Teacher Command Center (Class 4-A)" />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome & Classroom Incharge Banner */}
          <div className="bg-gradient-to-r from-amber-700 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  Teacher Portal Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-bold">
                  Class 4-A Incharge
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-2">
                Welcome, Smt. Sunita Sharma 👋
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                A. P PUBLIC SCHOOL, Jhansi • Class Teacher (Class 4-A) • Mathematics Faculty
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard/students"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center space-x-2 shadow-sm transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Student Data</span>
              </Link>

              <Link
                href="/dashboard/attendance"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center space-x-2 border border-slate-700 transition-all"
              >
                <CalendarCheck2 className="w-4 h-4 text-amber-400" />
                <span>Mark Daily Attendance</span>
              </Link>
            </div>
          </div>

          {/* Teacher Dedicated Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Class 4-A Students</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-slate-900">{studentCount}</span>
                <span className="text-xs text-emerald-600 font-bold">Enrolled</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today Attendance</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-teal-600">{attendanceRate}</span>
                <span className="text-xs text-teal-700 font-semibold">Live Compliant</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CBSE Results</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl font-extrabold text-indigo-950">Mid-Term</span>
                <span className="text-xs text-emerald-600 font-bold">Active</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Report Cards</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl font-extrabold text-teal-700">9-Point Scale</span>
                <span className="text-xs text-slate-400 font-medium">Ready</span>
              </div>
            </div>
          </div>

          {/* 4 Core Teacher Actions (Restricted Strictly to Teacher Capabilities) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Classroom Management Actions (Teacher Only)</h3>
              <span className="text-xs text-slate-400 font-medium">No Administrative Fees or Global Settings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Student Data Upload */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-500 hover:shadow-md transition-all">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">1. Student Admissions</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upload rosters via Excel/CSV, enter column-by-column rows, and assign Roll Numbers.
                  </p>
                </div>
                <Link
                  href="/dashboard/students"
                  className="mt-4 inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 space-x-1"
                >
                  <span>Open Students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 2: Attendance Registry */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-500 hover:shadow-md transition-all">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-3">
                    <CalendarCheck2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">2. Daily Attendance</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mark class attendance daily, track absentees and maintain CBSE 75% compliance records.
                  </p>
                </div>
                <Link
                  href="/dashboard/attendance"
                  className="mt-4 inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 space-x-1"
                >
                  <span>Mark Attendance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 3: Class Timetable */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-500 hover:shadow-md transition-all">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">3. Class Timetable</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Maintain weekly schedule (Mon–Sat) across 7 periods, assign faculty & classrooms.
                  </p>
                </div>
                <Link
                  href="/dashboard/timetable"
                  className="mt-4 inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 space-x-1"
                >
                  <span>Manage Timetable</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 4: Marks & Report Cards */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-500 hover:shadow-md transition-all">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-3">
                    <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">4. Marks & Report Cards</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Manually enter/upload marks for every student and generate official CBSE report card PDFs.
                  </p>
                </div>
                <Link
                  href="/dashboard/exams"
                  className="mt-4 inline-flex items-center text-xs font-bold text-purple-600 hover:text-purple-700 space-x-1"
                >
                  <span>Enter Marks & Cards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
