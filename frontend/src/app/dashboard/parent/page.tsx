'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface ChildStudent {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  class?: { name: string };
  section?: { name: string };
}

interface ChildDetails extends ChildStudent {
  attendances?: Array<{ status: string; date: string }>;
  feeInvoices?: Array<{ month: string; balanceAmount: number; status: string; dueDate: string }>;
  reportCards?: Array<{ percentage: number; overallGrade: string; publishedAt: string }>;
}

export default function ParentPortal() {
  const [children, setChildren] = useState<ChildStudent[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = () => typeof window !== 'undefined' ? localStorage.getItem('apps_token') : null;

  const loadChildren = async () => {
    setLoading(true);
    setError('');
    try {
      const accessToken = token();
      if (!accessToken) {
        window.location.replace('/login/parent');
        return;
      }
      const response = await fetch('/api/v1/parent/my-children', {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Unable to load linked student records.');
      const result = await response.json();
      const records = Array.isArray(result.data) ? result.data : [];
      setChildren(records);
      if (records.length > 0) await loadChildDetails(records[0].id, accessToken);
      else setSelectedChild(null);
    } catch (err: any) {
      setError(err?.message || 'Parent records are temporarily unavailable.');
      setChildren([]);
      setSelectedChild(null);
    } finally {
      setLoading(false);
    }
  };

  const loadChildDetails = async (studentId: string, accessToken = token()) => {
    if (!accessToken) return;
    const response = await fetch(`/api/v1/parent/children/${encodeURIComponent(studentId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Student details could not be verified for this parent account.');
    const result = await response.json();
    setSelectedChild(result.data || null);
  };

  useEffect(() => {
    void loadChildren();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userRole="PARENT" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Parent Portal • A. P PUBLIC SCHOOL" />
        <main className="p-4 sm:p-6 space-y-5">
          <section className="rounded-2xl bg-slate-900 text-white p-6">
            <h1 className="text-xl font-bold">Parent Portal</h1>
            <p className="text-sm text-slate-300 mt-1">Student information is loaded only from records linked to your authenticated account.</p>
          </section>

          {loading && <p className="text-sm text-slate-600">Loading verified student records…</p>}
          {error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {!loading && !error && children.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="font-semibold text-slate-800">No linked student record found</h2>
              <p className="text-sm text-slate-500 mt-2">Please contact the school office to verify the parent-to-student relationship.</p>
            </div>
          )}

          {!loading && selectedChild && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedChild.firstName} {selectedChild.lastName}</h2>
                <p className="text-sm text-slate-600">
                  Admission: {selectedChild.admissionNo} · {selectedChild.class?.name || 'Class not assigned'} · Section {selectedChild.section?.name || '—'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Attendance records loaded</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedChild.attendances?.length ?? 0}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Fee invoices</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedChild.feeInvoices?.length ?? 0}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Published report cards</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedChild.reportCards?.length ?? 0}</p>
                </div>
              </div>
              {selectedChild.feeInvoices && selectedChild.feeInvoices.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Fee invoices</h3>
                  <ul className="space-y-2">
                    {selectedChild.feeInvoices.map((invoice, index) => (
                      <li key={index} className="flex justify-between rounded-lg bg-slate-50 p-3 text-sm">
                        <span>{invoice.month} · {invoice.status}</span>
                        <span>Balance: ₹{Number(invoice.balanceAmount).toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedChild.reportCards && selectedChild.reportCards.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Published results</h3>
                  <ul className="space-y-2">
                    {selectedChild.reportCards.map((card, index) => (
                      <li key={index} className="rounded-lg bg-slate-50 p-3 text-sm">
                        {card.overallGrade} · {Number(card.percentage).toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
          <button onClick={() => void loadChildren()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
            Refresh verified records
          </button>
        </main>
      </div>
    </div>
  );
}
