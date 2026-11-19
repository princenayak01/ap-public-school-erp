'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export default function SecuritySessionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    // Public routes (landing, login portals, registration) require no session check
    if (!pathname || !pathname.startsWith('/dashboard')) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    setChecking(true);

    // 1. Strict Credential Verification
    const token = localStorage.getItem('apps_token');
    const storedUser = localStorage.getItem('apps_user');

    if (!token || !storedUser) {
      console.warn('[SECURITY GUARD] Access Denied: Unauthenticated visitor blocked from', pathname);
      wipeAndRedirect('/login');
      return;
    }

    let user: any = null;
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.warn('[SECURITY GUARD] Corrupt session token detected. Wiping...');
      wipeAndRedirect('/login');
      return;
    }

    if (!user || !user.role) {
      wipeAndRedirect('/login');
      return;
    }

    const role = user.role.toUpperCase();

    // 2. Strict Role-Based Access Control (RBAC)
    // A. Principal Master Dashboard & Sensitive Admin Controls
    if (pathname.startsWith('/dashboard/principal')) {
      if (role !== 'PRINCIPAL' && role !== 'SCHOOL_ADMIN') {
        console.warn(`[SECURITY GUARD] Unauthorized access attempt to Principal Control by ${role}. Redirecting...`);
        if (role === 'TEACHER') {
          window.location.replace('/dashboard/teacher');
        } else if (role === 'PARENT') {
          window.location.replace('/dashboard/parent');
        } else {
          wipeAndRedirect('/login');
        }
        return;
      }
    }

    // B. Teacher Dashboard
    if (pathname.startsWith('/dashboard/teacher')) {
      if (role !== 'TEACHER' && role !== 'PRINCIPAL') {
        console.warn(`[SECURITY GUARD] Blocked from Teacher Dashboard: Current role is ${role}`);
        if (role === 'PARENT') {
          window.location.replace('/dashboard/parent');
        } else {
          wipeAndRedirect('/login/teacher');
        }
        return;
      }
    }

    // C. Parent Dashboard
    if (pathname.startsWith('/dashboard/parent')) {
      if (role !== 'PARENT' && role !== 'PRINCIPAL') {
        console.warn(`[SECURITY GUARD] Blocked from Parent Portal: Current role is ${role}`);
        if (role === 'TEACHER') {
          window.location.replace('/dashboard/teacher');
        } else {
          wipeAndRedirect('/login/parent');
        }
        return;
      }
    }

    // D. Fees & Financial Ledger (Strictly Principal or Parent for Ward Dues)
    if (pathname.startsWith('/dashboard/fees')) {
      if (role === 'TEACHER') {
        // Teachers have no access to school fee collections or parent ledgers
        window.location.replace('/dashboard/teacher');
        return;
      }
    }

    // User is fully authenticated and role-authorized
    setAuthorized(true);
    setChecking(false);

    // Inactivity Auto-Logout Timer (15 Minutes of idle time)
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.warn('[SECURITY GUARD] Session expired due to 15-minute inactivity.');
        wipeAndRedirect('/login');
      }, 15 * 60 * 1000);
    };

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    // Cross-Tab Logout Synchronization
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === 'apps_token' && !e.newValue) {
        wipeAndRedirect('/login');
      }
    };
    window.addEventListener('storage', onStorageChange);

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
      window.removeEventListener('storage', onStorageChange);
    };
  }, [pathname]);

  const wipeAndRedirect = (destination: string) => {
    localStorage.removeItem('apps_token');
    localStorage.removeItem('apps_user');
    localStorage.removeItem('apps_active_role');
    sessionStorage.clear();
    setAuthorized(false);
    window.location.replace(destination);
  };

  // If on a protected route and not yet confirmed authorized, show security verification screen
  if (pathname && pathname.startsWith('/dashboard') && (!authorized || checking)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-base font-black tracking-tight text-white mb-1">
          A. P. PUBLIC SCHOOL SECURITY GUARD
        </h2>
        <p className="text-xs text-slate-400 font-mono flex items-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Verifying Institutional Security Clearance...</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
