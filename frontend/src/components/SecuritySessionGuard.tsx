'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SecuritySessionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only apply on protected dashboard pages
    if (!pathname || !pathname.startsWith('/dashboard')) return;

    // Check if user is actually authenticated
    const token = localStorage.getItem('apps_token') || localStorage.getItem('apps_user');
    if (!token) {
      window.location.replace('/login');
      return;
    }

    // Push dummy history entry so back button can be intercepted immediately
    window.history.pushState({ protected: true }, '', window.location.href);

    const performInstantLogout = () => {
      console.warn('[SECURITY GUARD] Auto-logout triggered. Clearing credentials...');
      localStorage.removeItem('apps_token');
      localStorage.removeItem('apps_user');
      localStorage.removeItem('apps_active_role');
      sessionStorage.clear();
      // Hard redirect to force clean unauthenticated state
      window.location.replace('/login');
    };

    const onPopState = (e: PopStateEvent) => {
      performInstantLogout();
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [pathname]);

  return <>{children}</>;
}
