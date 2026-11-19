import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  CalendarCheck2,
  FileSpreadsheet,
  Smartphone,
  Bot,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  BarChart3,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Decorative Background Lighting Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full glow-indigo pointer-events-none blur-[140px] -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full glow-teal pointer-events-none blur-[140px] -z-10" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] rounded-full glow-amber pointer-events-none blur-[160px] -z-10" />

      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 border-b border-indigo-500/20 px-4 py-2 text-xs text-center text-indigo-200 flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        <span className="font-semibold tracking-wide">
          Official CBSE School ERP • Academic Session 2026–27 Admissions Open (Nursery to Class 8)
        </span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] border border-teal-500/30">
          AFFILIATION ACTIVE
        </span>
      </div>

      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="h-10 sm:h-12 px-2 rounded-xl overflow-hidden bg-black p-0.5 flex items-center justify-center shadow-xl shadow-amber-500/10 border border-amber-400/80 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="A. P Public School Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate block">A. P PUBLIC SCHOOL</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] sm:text-[10px] border border-amber-500/30">
                CBSE
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-400 block font-medium truncate">Darausagar • Jhansi (UP) • Learn • Grow • Succeed</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <Link
            href="/dashboard/parent"
            className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs tracking-wide transition-all items-center space-x-1.5"
          >
            <span>Parent Portal</span>
          </Link>
          <Link
            href="/login"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section with Graphic Header */}
      <section className="pt-12 pb-12 px-6 max-w-6xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-[280px] sm:max-w-[360px] rounded-3xl bg-black border-2 border-amber-500/40 p-3.5 shadow-2xl shadow-amber-500/20 backdrop-blur-xl transform hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="A. P. Public School Official Crest" className="w-full h-auto max-h-40 sm:max-h-48 object-contain filter drop-shadow" />
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Next-Generation School Management & Parent Portal</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Excellence in Learning at <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 drop-shadow-sm">
            A. P PUBLIC SCHOOL, Jhansi
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          One unified system empowering the Principal, Teachers, Accountants, and Parents. Complete with daily attendance, online Razorpay fee payments, CBSE 9-point grading, and AI school assistance.
        </p>

        {/* 3 Dedicated Dashboard Doors */}
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/dashboard/teacher"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold text-sm shadow-xl shadow-amber-600/30 hover:shadow-amber-600/50 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>👩‍🏫 Teacher Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/parent"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-teal-600/30 hover:shadow-teal-600/50 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>👨‍👩‍👧 Parent Portal</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/principal"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 border border-indigo-500/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>👑 Principal Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Graphic Metric Counter Pills */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-white">342+</div>
            <div className="text-xs font-semibold text-teal-400 mt-0.5">Enrolled Students</div>
            <div className="text-[10px] text-slate-500 mt-1">Nursery to Class 8</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">24</div>
            <div className="text-xs font-semibold text-indigo-300 mt-0.5">Certified Faculty</div>
            <div className="text-[10px] text-slate-500 mt-1">Qualified CBSE Staff</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs font-semibold text-emerald-300 mt-0.5">CBSE Pass Rate</div>
            <div className="text-[10px] text-slate-500 mt-1">Academic Year 2026–27</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">Razorpay</div>
            <div className="text-xs font-semibold text-amber-300 mt-0.5">Online Fee Portal</div>
            <div className="text-[10px] text-slate-500 mt-1">Instant Verified Receipts</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Integrated Institutional Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Designed specifically for CBSE affiliated schools with comprehensive administrative control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <Link
            href="/dashboard/principal"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1.5 flex items-center justify-between">
              <span>Principal Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time KPIs, class-wise distribution graphics, teacher metrics, financial summaries, and institutional audit trail.
            </p>
          </Link>

          {/* Card 2 */}
          <Link
            href="/dashboard/parent"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/90 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1.5 flex items-center justify-between">
              <span>Parent Portal (Multi-Child)</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch effortlessly between multiple wards, check live attendance, pay school fees online, and download CBSE report cards.
            </p>
          </Link>

          {/* Card 3 */}
          <Link
            href="/dashboard/attendance"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1.5 flex items-center justify-between">
              <span>Attendance & Multi-Day Bulk Save</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily section attendance with instant toggles plus a bulk date-range generator to save all days across months with weekend exclusion.
            </p>
          </Link>

          {/* Card 4 */}
          <Link
            href="/dashboard/fees"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1.5 flex items-center justify-between">
              <span>Fee Ledger & Razorpay</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Class-wise fee structures, automatic tuition generation, partial payments, offline counter cash/cheque recording, and PDF receipts.
            </p>
          </Link>

          {/* Card 5 */}
          <Link
            href="/dashboard/exams"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1.5 flex items-center justify-between">
              <span>CBSE 9-Point Grading Ledger</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mid-term and annual exams, subject mark entries, automatic conversion to A1-E scale, student rank calculation, and PDF report cards.
            </p>
          </Link>

          {/* Card 6 */}
          <Link
            href="/dashboard/ai-assistant"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-1.5 flex items-center justify-between">
              <span>School AI Assistant (RAG)</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Role-restricted artificial intelligence assistant capable of answering school timings, fee rules, syllabus policies, and child dues.
            </p>
          </Link>
        </div>
      </section>

      {/* Footer Info Banner */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 px-6 text-xs text-slate-400 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-bold text-white text-sm mb-1 flex items-center justify-center md:justify-start space-x-2">
              <span>A. P PUBLIC SCHOOL, JHANSI</span>
              <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px]">
                CBSE NEW DELHI
              </span>
            </div>
            <p className="text-slate-400">
              Behind P.N.B. Bank, Naya Bus Stand Road, Baruasagar, Jhansi (U.P.) - 284001
            </p>
            <p className="text-slate-500 mt-1">Academic Session 2026–27 • Affiliation & Curriculum Compliant</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>+91-6306262479</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>apps.jhansi@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pt-6 border-t border-slate-900 text-slate-600 text-[11px]">
          © 2026 A. P PUBLIC SCHOOL. All rights reserved. Production School ERP & Android Application Suite.
        </div>
      </footer>
    </div>
  );
}
