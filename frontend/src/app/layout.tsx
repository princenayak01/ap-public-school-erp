import type { Metadata, Viewport } from 'next';
import './globals.css';
import SecuritySessionGuard from '@/components/SecuritySessionGuard';

export const metadata: Metadata = {
  title: 'A. P. PUBLIC SCHOOL • School ERP & Parent Portal (CBSE)',
  description: 'Integrated School ERP for A. P. PUBLIC SCHOOL, Baruasagar, Jhansi (CBSE, Session 2026-27)',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <SecuritySessionGuard>{children}</SecuritySessionGuard>
      </body>
    </html>
  );
}
