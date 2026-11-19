'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function ParentLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: identifier.trim(), password }),
      });

      const data = await res.json();

      if (data.success && data.data?.user) {
        const user = data.data.user;

        if (user.role !== 'PARENT' && user.role !== 'STUDENT') {
          setError(`Yeh login page Parents / Guardians ke liye hai. Aapka registered role ${user.role} hai. Kripya apne sahi login page ka upyog karein.`);
          return;
        }

        localStorage.setItem('apps_token', data.data.accessToken);
        localStorage.setItem('apps_user', JSON.stringify(user));
        localStorage.setItem('apps_active_role', 'PARENT');

        router.push('/dashboard/parent');
      } else {
        setError(data.message || 'Galat Mobile / Email ya Password. Kripya check karein.');
      }
    } catch (err: any) {
      setError('Server se connect nahi ho paya. Kripya dobara prayaas karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-teal-500/30 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-18 h-18 mx-auto rounded-3xl overflow-hidden bg-white/10 p-1 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-3 ring-2 ring-teal-400/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="A. P. Public School Logo" className="w-full h-full object-contain" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
            Parent & Guardian Portal
          </span>
          <h1 className="text-xl font-black text-white tracking-tight mt-2">Parent Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">A. P. PUBLIC SCHOOL, Baruasagar, Jhansi • Ward Management</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Registered Mobile Number or Email
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-500"
                placeholder="e.g. +91-9198765432 or parent@gmail.com"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Opening Ward Portal...' : 'Login as Parent'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Parent Access Features Notice */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-teal-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Parent Access Capabilities:</span>
          </p>
          <p>✓ View Child&apos;s Live Attendance • View & Pay Fees (Razorpay) • Download CBSE Report Card</p>
          <p className="text-slate-500">🔒 Strictly view-only. Cannot edit attendance or exam marks.</p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            School Admission ke baad account nahi mila?{' '}
            <Link href="/register" className="text-teal-400 font-bold hover:underline">
              Register Ward Online
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
