'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function PrincipalLoginPage() {
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

        if (user.role !== 'PRINCIPAL' && user.role !== 'SCHOOL_ADMIN' && user.role !== 'ACCOUNTANT') {
          setError(`Yeh login page sirf School Principal & Super Admin ke liye hai. Aapka role ${user.role} hai.`);
          return;
        }

        localStorage.setItem('apps_token', data.data.accessToken);
        localStorage.setItem('apps_user', JSON.stringify(user));
        localStorage.setItem('apps_active_role', 'PRINCIPAL');

        router.push('/dashboard/principal');
      } else {
        setError(data.message || 'Galat Administrator Credentials. Kripya check karein.');
      }
    } catch (err: any) {
      setError('Server se connect nahi ho paya. Kripya check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/30 mb-3 ring-2 ring-indigo-400/30">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Master Administrative Control
          </span>
          <h1 className="text-xl font-black text-white tracking-tight mt-2">Principal & Admin Login</h1>
          <p className="text-xs text-slate-400 mt-1">A. P PUBLIC SCHOOL, Jhansi • Executive Clearance</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Principal / Administrator Email or ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500 font-mono"
                placeholder="Enter Principal / Admin Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Master Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
                placeholder="Enter Master Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating Executive...' : 'Login as Principal / Super Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Master Scope Notice */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-indigo-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Executive Authority:</span>
          </p>
          <p>✓ All Management • Approve/Reject Registered Teachers • Fee Collections • Full Institutional Control</p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center space-y-2">
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
