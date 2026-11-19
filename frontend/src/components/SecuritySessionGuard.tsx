'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';

export default function SecuritySessionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!pathname || !pathname.startsWith('/dashboard')) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    let active = true;
    let cleanupSession = () => {};
    setAuthorized(false);
    setChecking(true);

    const wipeAndRedirect = (destination: string) => {
      localStorage.removeItem('apps_token');
      localStorage.removeItem('apps_user');
      localStorage.removeItem('apps_active_role');
      sessionStorage.clear();
      if (active) {
        setAuthorized(false);
        setChecking(false);
      }
      window.location.replace(destination);
    };

    const verifySession = async () => {
      const token = localStorage.getItem('apps_token');
      const storedUserRaw = localStorage.getItem('apps_user');

      if (!token || !storedUserRaw) {
        wipeAndRedirect('/login');
        return;
      }

      let storedUser: any;
      try {
        storedUser = JSON.parse(storedUserRaw);
      } catch {
        wipeAndRedirect('/login');
        return;
      }

      if (!storedUser?.id) {
        wipeAndRedirect('/login');
        return;
      }

      try {
        // The API, not localStorage, is the authority for identity and role.
        const response = await fetch('/api/v1/auth/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (!response.ok) {
          wipeAndRedirect('/login');
          return;
        }

        const result = await response.json();
        const user = result?.data;
        if (!user?.id || user.id !== storedUser.id || !user.role) {
          wipeAndRedirect('/login');
          return;
        }

        if (!active) return;
        localStorage.setItem('apps_user', JSON.stringify(user));
        const role = String(user.role).toUpperCase();

        if (pathname.startsWith('/dashboard/principal') && !['PRINCIPAL', 'SCHOOL_ADMIN'].includes(role)) {
          wipeAndRedirect('/login');
          return;
        }
        if (pathname.startsWith('/dashboard/teacher') && !['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN'].includes(role)) {
          wipeAndRedirect('/login/teacher');
          return;
        }
        if (pathname.startsWith('/dashboard/parent') && !['PARENT', 'PRINCIPAL'].includes(role)) {
          wipeAndRedirect('/login/parent');
          return;
        }
        if (pathname.startsWith('/dashboard/fees') && role === 'TEACHER') {
          wipeAndRedirect('/dashboard/teacher');
          return;
        }

        setAuthorized(true);
        setChecking(false);

        window.history.pushState({ protected: true }, '', window.location.href);
        const onPopState = () => wipeAndRedirect('/login');

        let inactivityTimer: ReturnType<typeof setTimeout>;
        const resetTimer = () => {
          clearTimeout(inactivityTimer);
          inactivityTimer = setTimeout(() => wipeAndRedirect('/login'), 15 * 60 * 1000);
        };
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        activityEvents.forEach((eventName) => window.addEventListener(eventName, resetTimer));
        resetTimer();

        const onStorageChange = (event: StorageEvent) => {
          if (event.key === 'apps_token' && !event.newValue) wipeAndRedirect('/login');
        };
        window.addEventListener('popstate', onPopState);
        window.addEventListener('storage', onStorageChange);

        cleanupSession = () => {
          window.removeEventListener('popstate', onPopState);
          window.removeEventListener('storage', onStorageChange);
          clearTimeout(inactivityTimer);
          activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
        };
      } catch {
        wipeAndRedirect('/login');
      }
    };

    void verifySession();
    return () => {
      active = false;
      cleanupSession();
    };
  }, [pathname]);

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
          <span>Verifying server-authorized session...</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
