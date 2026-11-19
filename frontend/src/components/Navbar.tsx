'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, LogOut, ShieldCheck, UserCog, Menu } from 'lucide-react';
import PrincipalProfileModal from './PrincipalProfileModal';

export default function Navbar({ title = 'School ERP Management' }: { title?: string }) {
  const router = useRouter();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [role, setRole] = useState<'TEACHER' | 'PARENT' | 'PRINCIPAL'>('PRINCIPAL');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: true }));
      setDateStr(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('apps_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        if (parsed.role) setRole(parsed.role);
        return;
      }
    } catch (e) {}

    const storedRole = localStorage.getItem('apps_active_role');
    if (storedRole === 'TEACHER' || storedRole === 'PARENT' || storedRole === 'PRINCIPAL') {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('apps_token');
    localStorage.removeItem('apps_user');
    localStorage.removeItem('apps_active_role');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3.5 sm:px-6 flex items-center justify-between shadow-xs font-sans sticky top-0 z-30">
      <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white p-0.5 border border-amber-300 shadow-sm shrink-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="A. P. Public School Logo" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate leading-tight">{title}</h2>
          <p className="text-[10px] sm:text-[11px] text-amber-700 font-bold truncate">A. P. PUBLIC SCHOOL • Baruasagar, Jhansi</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Live Date & Time Widget (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dateStr || 'Wednesday, 18 Nov 2026'}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1.5 font-mono text-slate-800 font-bold">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{timeStr || '04:45:00 PM'}</span>
          </div>
        </div>

        {/* Authenticated Role Status Badge (Tablet / Desktop Only) */}
        <span className={`hidden md:flex px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider items-center space-x-1 border ${
          role === 'TEACHER' ? 'bg-amber-50 text-amber-800 border-amber-200' :
          role === 'PARENT' ? 'bg-teal-50 text-teal-800 border-teal-200' :
          'bg-indigo-50 text-indigo-800 border-indigo-200'
        }`}>
          <span>{role === 'TEACHER' ? '👩‍🏫 Teacher Account' : role === 'PARENT' ? '👨‍👩‍👧 Parent Account' : '👑 Principal Admin'}</span>
        </span>

        {/* Principal Edit Profile Button */}
        {role === 'PRINCIPAL' && (
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Edit Principal Profile, Email & Password"
          >
            <UserCog className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        )}

        {/* User Profile Pill */}
        <div
          onClick={() => {
            if (role === 'PRINCIPAL') setShowProfileModal(true);
          }}
          className={`flex items-center space-x-2 pl-1 ${role === 'PRINCIPAL' ? 'cursor-pointer hover:opacity-85 p-1 rounded-xl transition-all' : ''}`}
          title={role === 'PRINCIPAL' ? 'Click to Edit Principal Profile & Credentials' : undefined}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs ${
            role === 'TEACHER' ? 'bg-amber-600' :
            role === 'PARENT' ? 'bg-teal-600' :
            'bg-indigo-900 ring-2 ring-indigo-300'
          }`}>
            {currentUser?.name?.[0] || (role === 'TEACHER' ? 'T' : role === 'PARENT' ? 'P' : 'A')}
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-extrabold text-slate-800 leading-tight flex items-center space-x-1">
              <span>{currentUser?.name || (role === 'TEACHER' ? 'Sunita Sharma' : role === 'PARENT' ? 'Vikas Sharma' : 'Dr. R. K. Sharma')}</span>
              {role === 'PRINCIPAL' && <UserCog className="w-3 h-3 text-indigo-600 inline" />}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold flex items-center space-x-1.5">
              <span>{role === 'TEACHER' ? 'Class Incharge' : role === 'PARENT' ? 'Guardian' : 'Super Administrator'}</span>
              {role === 'PRINCIPAL' && (
                <span className="font-mono text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded border border-indigo-200">
                  ID: {currentUser?.userId || currentUser?.id || 'APPS-PRINCIPAL-01'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Principal Profile Modal */}
        {role === 'PRINCIPAL' && (
          <PrincipalProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onProfileUpdated={(updated) => setCurrentUser(updated)}
          />
        )}

        {/* Logout Quick Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5 sm:ml-1 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
