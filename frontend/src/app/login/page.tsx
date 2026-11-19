'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Users,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Lock,
  Mail,
  Phone
} from 'lucide-react';

export default function UnifiedLoginDirectory() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col justify-center items-center py-8 px-3.5 sm:px-4 relative overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-indigo-600/20 blur-[100px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-teal-500/20 blur-[100px] sm:blur-[130px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-6 sm:space-y-8">
        {/* Institutional Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-white/10 p-1 flex items-center justify-center shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="A. P. Public School Logo" className="w-full h-full object-contain" />
          </div>
          <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            CBSE Affiliated • Code 2130000 • Baruasagar, Jhansi
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            A. P. PUBLIC SCHOOL
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            LEARN • GROW • SUCCEED • Choose your designated institutional login portal below to access your role-specific dashboard.
          </p>
        </div>

        {/* 3 Dedicated Login Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Door 1: Class Teacher */}
          <Link
            href="/login/teacher"
            className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-900 transition-all group shadow-xl flex flex-col justify-between hover:scale-[1.02] transform"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                Academic Faculty Portal
              </span>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                Class Teacher Login
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Add students, mark daily attendance, maintain timetable, and manually upload marks for CBSE report cards.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Enter Teacher Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Door 2: Parents */}
          <Link
            href="/login/parent"
            className="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 hover:border-teal-400 hover:bg-slate-900 transition-all group shadow-xl flex flex-col justify-between hover:scale-[1.02] transform"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block mb-1">
                Parent & Guardian Portal
              </span>
              <h3 className="text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                Parent Login
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Check your ward&apos;s attendance compliance, view pending tuition fees, submit fees online via Razorpay, and download report cards.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>Enter Parent Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Door 3: Principal & Super Admin */}
          <Link
            href="/login/principal"
            className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 hover:bg-slate-900 transition-all group shadow-xl flex flex-col justify-between hover:scale-[1.02] transform"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block mb-1">
                Executive Administration
              </span>
              <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                Principal & Admin Login
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Master control: approve registered teachers, oversee all classes, monitor school finances, and review CBSE ledgers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>Enter Principal Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Bottom Navigation & Registration Links */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Need to register a new account?{' '}
            <Link href="/register" className="text-teal-400 font-bold hover:underline">
              Teacher & Ward Registration Online
            </Link>
          </div>
          <div>
            <Link href="/" className="hover:text-white transition-colors">
              ← Return to School Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
