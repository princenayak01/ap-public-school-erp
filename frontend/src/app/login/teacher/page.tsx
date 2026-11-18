'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Lock, Hash, ArrowRight, ShieldCheck, AlertTriangle, KeyRound, CheckCircle2 } from 'lucide-react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsPendingApproval(false);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: identifier.trim(), password }),
      });

      const data = await res.json();

      if (res.status === 403 || data.message?.includes('Pending') || data.message?.includes('approval')) {
        setIsPendingApproval(true);
        setError(data.message || 'Aapka Teacher account School Admin / Principal approval ke liye pending hai. Approval ke baad hi aap login kar sakenge.');
        return;
      }

      if (data.success && data.data?.user) {
        const user = data.data.user;

        // Verify role is TEACHER
        if (user.role !== 'TEACHER') {
          setError(`Yeh login page sirf Class Teachers ke liye hai. Aapka account role ${user.role} hai. Kripya apne sahi login page ka upyog karein.`);
          return;
        }

        // Store tokens & role
        localStorage.setItem('apps_token', data.data.accessToken);
        localStorage.setItem('apps_user', JSON.stringify(user));
        localStorage.setItem('apps_active_role', 'TEACHER');

        router.push('/dashboard/teacher');
      } else {
        setError(data.message || 'Galat User ID ya Password. Kripya dobara check karein.');
      }
    } catch (err: any) {
      setError('Server se connect nahi ho paya. Kripya check karein ki backend chalu hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/30 mb-3 ring-2 ring-amber-400/30">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Faculty & Class Incharge Portal
          </span>
          <h1 className="text-xl font-black text-white tracking-tight mt-2">Class Teacher Login</h1>
          <p className="text-xs text-slate-400 mt-1">A. P PUBLIC SCHOOL, Jhansi • Academic Access</p>
        </div>

        {/* Approval Pending Warning Card */}
        {isPendingApproval && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Admin Approval Pending!</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200">
              Aapka 1-Time OTP verify ho chuka hai, lekin Principal / School Admin ne abhi tak aapke account ko approve nahi kiya hai.
            </p>
            <p className="text-[11px] text-slate-400">
              Principal dwara approve karte hi aap yahan login kar payenge.
            </p>
          </div>
        )}

        {error && !isPendingApproval && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Teacher ID / Mobile Number / Email
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-500"
                placeholder="e.g. TCH-2026-01 or 9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating Teacher...' : 'Login as Class Teacher'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Allowed Access Notice */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-amber-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Teacher Access Permissions:</span>
          </p>
          <p>✓ Add Students & Roll Numbers • Daily Attendance • Class Timetable • Manual Marks & Report Card</p>
          <p className="text-slate-500">✗ Fees & Financial Settings are strictly hidden from Teachers.</p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Naye Teacher hain?{' '}
            <Link href="/register" className="text-amber-400 font-bold hover:underline">
              1-Time OTP se Register karein
            </Link>
          </p>

          <p className="text-[11px] text-slate-500">
            <Link href="/login" className="hover:text-slate-300">
              ← Main Portal Switcher
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
