'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  CalendarCheck2,
  FileSpreadsheet,
  Bot,
  LogOut,
  Clock,
  ShieldCheck,
  Lock,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [role, setRole] = useState<'TEACHER' | 'PARENT' | 'PRINCIPAL'>('TEACHER');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('apps_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        if (parsed.role === 'TEACHER' || parsed.role === 'PARENT' || parsed.role === 'PRINCIPAL') {
          setRole(parsed.role);
          return;
        }
      }
    } catch (e) {}

    // Fallback to active role or userRole prop
    const storedRole = localStorage.getItem('apps_active_role');
    if (storedRole === 'TEACHER' || storedRole === 'PARENT' || storedRole === 'PRINCIPAL') {
      setRole(storedRole);
    } else if (userRole === 'TEACHER' || userRole === 'PARENT' || userRole === 'PRINCIPAL') {
      setRole(userRole);
    } else if (pathname.includes('/dashboard/teacher')) {
      setRole('TEACHER');
    } else if (pathname.includes('/dashboard/parent')) {
      setRole('PARENT');
    } else if (pathname.includes('/dashboard/principal')) {
      setRole('PRINCIPAL');
    }
  }, [pathname, userRole]);

  // Listen for mobile drawer toggle events from Navbar
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    window.addEventListener('close-mobile-sidebar', handleClose);

    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggle);
      window.removeEventListener('close-mobile-sidebar', handleClose);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('apps_token');
    localStorage.removeItem('apps_user');
    localStorage.removeItem('apps_active_role');
    router.push('/login');
  };

  // 1. Teacher-Only Navigation
  const teacherNav = [
    { name: 'Teacher Command Center', href: '/dashboard/teacher', icon: LayoutDashboard },
    { name: 'Students & Data Upload', href: '/dashboard/students', icon: GraduationCap },
    { name: 'Daily Attendance', href: '/dashboard/attendance', icon: CalendarCheck2 },
    { name: 'Class Timetable', href: '/dashboard/timetable', icon: Clock },
    { name: 'Exams & CBSE Marks', href: '/dashboard/exams', icon: FileSpreadsheet },
    { name: 'AI School Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  ];

  // 2. Parent-Only Navigation
  const parentNav = [
    { name: 'My Children', href: '/dashboard/parent', icon: Users },
    { name: 'Fee Dues & Online Pay', href: '/dashboard/fees', icon: CreditCard },
    { name: 'Child Attendance Record', href: '/dashboard/attendance', icon: CalendarCheck2 },
    { name: 'Class Timetable', href: '/dashboard/timetable', icon: Clock },
    { name: 'CBSE Report Cards', href: '/dashboard/exams', icon: FileSpreadsheet },
    { name: 'AI School Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  ];

  // 3. Principal Master Navigation
  const principalNav = [
    { name: 'Principal Master Dashboard', href: '/dashboard/principal', icon: LayoutDashboard },
    { name: 'Students & Admissions', href: '/dashboard/students', icon: GraduationCap },
    { name: 'Fees & Razorpay Collections', href: '/dashboard/fees', icon: CreditCard },
    { name: 'School-wide Attendance', href: '/dashboard/attendance', icon: CalendarCheck2 },
    { name: 'Master Timetable', href: '/dashboard/timetable', icon: Clock },
    { name: 'Exams & CBSE Results', href: '/dashboard/exams', icon: FileSpreadsheet },
    { name: 'Parent Portal Preview', href: '/dashboard/parent', icon: Users },
    { name: 'AI School Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  ];

  const navItems = role === 'TEACHER' ? teacherNav : role === 'PARENT' ? parentNav : principalNav;

  // Bottom Nav shortcuts tailored for mobile view
  const bottomNavItems =
    role === 'TEACHER'
      ? [
          { name: 'Home', href: '/dashboard/teacher', icon: LayoutDashboard },
          { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
          { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck2 },
          { name: 'Marks', href: '/dashboard/exams', icon: FileSpreadsheet },
        ]
      : role === 'PARENT'
      ? [
          { name: 'Ward', href: '/dashboard/parent', icon: Users },
          { name: 'Pay Fees', href: '/dashboard/fees', icon: CreditCard },
          { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck2 },
          { name: 'Report Card', href: '/dashboard/exams', icon: FileSpreadsheet },
        ]
      : [
          { name: 'Overview', href: '/dashboard/principal', icon: LayoutDashboard },
          { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
          { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
          { name: 'Exams', href: '/dashboard/exams', icon: FileSpreadsheet },
        ];

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* School Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 border border-amber-400/80 shadow-md shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="A. P. Public School Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-xs sm:text-sm tracking-tight text-white leading-tight uppercase">
                A. P. PUBLIC SCHOOL
              </h1>
              <p className="text-[10px] sm:text-[11px] text-amber-400 font-bold">Baruasagar • Jhansi (CBSE)</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authenticated Account Badge */}
        <div className="p-3 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white ${
              role === 'TEACHER' ? 'bg-amber-600' :
              role === 'PARENT' ? 'bg-teal-600' :
              'bg-indigo-600'
            }`}>
              {role === 'TEACHER' ? '👩‍🏫' : role === 'PARENT' ? '👨‍👩‍👧' : '👑'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {currentUser?.name || (role === 'TEACHER' ? 'Sunita Sharma' : role === 'PARENT' ? 'Vikas Sharma' : 'Principal Sharma')}
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                  role === 'TEACHER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  role === 'PARENT' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {role} ACCOUNT
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {role === 'TEACHER' ? 'Teacher Classroom Menu' : role === 'PARENT' ? 'Parent Ward Menu' : 'Executive Admin Menu'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? role === 'TEACHER'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : role === 'PARENT'
                      ? 'bg-teal-600 text-white font-black shadow-lg shadow-teal-600/30'
                      : 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? role === 'TEACHER' ? 'text-slate-950' : 'text-white'
                    : role === 'TEACHER' ? 'text-amber-400'
                    : role === 'PARENT' ? 'text-teal-400'
                    : 'text-indigo-400'
                }`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2.5 bg-slate-950/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Session: <strong className="text-white">2026–27</strong></span>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Secure</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer min-h-[40px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout ({role})</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white min-h-screen flex-col justify-between border-r border-slate-800 shadow-xl shrink-0 font-sans sticky top-0 h-screen overflow-y-auto">
        {renderNavContent()}
      </aside>

      {/* 2. Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Pane */}
          <div className="relative w-72 max-w-[85vw] bg-slate-900 text-white shadow-2xl flex flex-col z-50 h-full overflow-y-auto border-r border-slate-800 animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* 3. Mobile Bottom Navigation Bar (Native App Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all min-w-[56px] ${
                isActive
                  ? role === 'TEACHER'
                    ? 'text-amber-400 font-black'
                    : role === 'PARENT'
                    ? 'text-teal-400 font-black'
                    : 'text-indigo-400 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        {/* Menu Drawer Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all min-w-[56px]"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>Menu</span>
        </button>
      </div>
    </>
  );
}
