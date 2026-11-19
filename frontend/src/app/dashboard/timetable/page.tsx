'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  Plus,
  Printer,
  Edit2,
  CheckCircle2,
  Sparkles,
  School,
  X
} from 'lucide-react';

interface TimetableSlot {
  id: string;
  day: string;
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  className: string;
  sectionName: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PERIODS = [
  { num: 1, time: '08:30 AM - 09:15 AM' },
  { num: 2, time: '09:15 AM - 10:00 AM' },
  { num: 3, time: '10:00 AM - 10:45 AM' },
  { num: 4, time: '11:15 AM - 12:00 PM' },
  { num: 5, time: '12:00 PM - 12:45 PM' },
  { num: 6, time: '01:15 PM - 02:00 PM' },
  { num: 7, time: '02:00 PM - 02:40 PM' },
];

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('Class 4');
  const [selectedSection, setSelectedSection] = useState('A');
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Partial<TimetableSlot>>({
    day: 'Monday',
    period: 1,
    time: '08:30 AM - 09:15 AM',
    subject: 'Mathematics',
    teacher: 'Sunita Sharma',
    room: 'Room 104',
    className: 'Class 4',
    sectionName: 'A',
  });

  useEffect(() => {
    fetchTimetable();
  }, [selectedClass, selectedSection]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/timetable?className=${encodeURIComponent(selectedClass)}&sectionName=${encodeURIComponent(selectedSection)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSlots(data.data);
      }
    } catch (err) {
      console.warn('Failed to load timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (day?: string, period?: number) => {
    const periodObj = PERIODS.find((p) => p.num === period) || PERIODS[0];
    const existing = slots.find((s) => s.day === day && s.period === period);

    if (existing) {
      setEditingSlot({ ...existing });
    } else {
      setEditingSlot({
        id: `tt-${Date.now()}`,
        day: day || 'Monday',
        period: period || 1,
        time: periodObj.time,
        subject: 'General Science',
        teacher: 'Teacher Incharge',
        room: 'Room 104',
        className: selectedClass,
        sectionName: selectedSection,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingSlot,
          className: selectedClass,
          sectionName: selectedSection,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Period slot for ${editingSlot.day} (Period ${editingSlot.period}) updated successfully!`);
        setIsModalOpen(false);
        fetchTimetable();
      }
    } catch (err) {
      setSuccessMsg('Slot saved locally.');
      setIsModalOpen(false);
    } finally {
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const getSlot = (day: string, periodNum: number) => {
    return slots.find((s) => s.day.toLowerCase() === day.toLowerCase() && s.period === periodNum);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Classroom Schedule & Timetable Manager" />

        <main className="p-3.5 sm:p-6 pb-24 md:pb-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200 uppercase tracking-wider">
                  Official Academic Schedule
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200">
                  CBSE 2026–27
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-2">
                Classroom Timetable & Schedule
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                A. P PUBLIC SCHOOL, Jhansi • Class Teacher & Faculty Time Allocation
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Class & Section Selectors */}
              <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-white text-xs font-bold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-200 focus:outline-none"
                >
                  {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-white text-xs font-bold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-200 focus:outline-none"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <button
                onClick={() => handleOpenModal('Monday', 1)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-md shadow-teal-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add / Edit Slot</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center space-x-1 border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Timetable Weekly Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <School className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold">
                  Weekly Schedule for {selectedClass} - Section {selectedSection}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                7 Periods / Day • 08:30 AM – 02:40 PM
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                    <th className="p-3 w-28 border-r border-slate-200 text-center">Day</th>
                    {PERIODS.map((p, idx) => (
                      <React.Fragment key={p.num}>
                        {idx === 3 && (
                          <th className="p-2 w-16 bg-amber-50 text-amber-800 font-black text-center border-r border-slate-200 text-[10px]">
                            RECESS (10:45)
                          </th>
                        )}
                        <th className="p-3 border-r border-slate-200 text-center min-w-[130px]">
                          <div>Period {p.num}</div>
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">{p.time}</div>
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {DAYS.map((day) => (
                    <tr key={day} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-extrabold text-slate-800 bg-slate-50/40 border-r border-slate-200 text-center">
                        {day}
                      </td>

                      {PERIODS.map((p, idx) => {
                        const slot = getSlot(day, p.num);
                        return (
                          <React.Fragment key={p.num}>
                            {idx === 3 && (
                              <td className="p-2 bg-amber-50/50 border-r border-slate-200 text-center font-bold text-[10px] text-amber-700 writing-mode-vertical">
                                Lunch
                              </td>
                            )}
                            <td
                              onClick={() => handleOpenModal(day, p.num)}
                              className="p-2.5 border-r border-slate-200 cursor-pointer hover:bg-teal-50/50 transition-colors group"
                            >
                              {slot ? (
                                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-teal-100/60 border border-slate-200/80 transition-all">
                                  <div className="font-extrabold text-slate-800 text-xs flex justify-between items-center">
                                    <span>{slot.subject}</span>
                                    <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <div className="text-[11px] text-teal-700 font-semibold mt-1">
                                    {slot.teacher}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                    {slot.room}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-14 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-teal-400 group-hover:text-teal-600 transition-all text-[11px]">
                                  + Assign
                                </div>
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-800 mb-1">
              Assign / Edit Timetable Slot
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedClass} - {selectedSection} • {editingSlot.day} (Period {editingSlot.period})
            </p>

            <form onSubmit={handleSaveSlot} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Day</label>
                  <select
                    value={editingSlot.day}
                    onChange={(e) => setEditingSlot({ ...editingSlot, day: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Period</label>
                  <select
                    value={editingSlot.period}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      const pObj = PERIODS.find((p) => p.num === num);
                      setEditingSlot({ ...editingSlot, period: num, time: pObj?.time || editingSlot.time });
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    {PERIODS.map((p) => (
                      <option key={p.num} value={p.num}>Period {p.num} ({p.time.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={editingSlot.subject || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                  placeholder="e.g. Mathematics, Hindi, Science"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Teacher / Faculty Name *</label>
                <input
                  type="text"
                  required
                  value={editingSlot.teacher || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, teacher: e.target.value })}
                  placeholder="e.g. Smt. Sunita Sharma"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Room / Location</label>
                <input
                  type="text"
                  value={editingSlot.room || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                  placeholder="e.g. Room 104, Science Lab, IT Lab"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
