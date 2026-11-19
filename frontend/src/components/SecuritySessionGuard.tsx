'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SecuritySessionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Detect Back Button navigation or Tab Visibility Change (Auto-Logout Protection)
    const handlePopState = (event: PopStateEvent) => {
      // If user is inside a protected dashboard and presses Browser Back button
      if (pathname.startsWith('/dashboard')) {
        console.warn('[SECURITY] Back button detected! Auto-logging out session for protection.');
        localStorage.removeItem('apps_token');
        localStorage.removeItem('apps_user');
        localStorage.removeItem('apps_active_role');
        sessionStorage.clear();
        router.replace('/login');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);

  return <>{children}</>;
}
