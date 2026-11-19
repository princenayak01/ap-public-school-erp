'use client';

import { authenticatedFetch } from '@/lib/api';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Bot, Send, User, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  source?: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    sender: 'ai',
    text: 'Hello! I am the official AI Assistant for A. P PUBLIC SCHOOL, Jhansi. You can ask me about school timings, fee payment rules, CBSE 9-point grading, admission guidelines, or your student fee dues.',
    source: 'School Handbook 2026-27',
    time: '4:45 PM',
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await authenticatedFetch('/api/v1/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apps_token') || ''}`,
        },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.data.answer,
            source: data.data.source,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Local intelligent fallback
        fallbackResponse(q);
      }
    } catch {
      fallbackResponse(q);
    } finally {
      setLoading(false);
    }
  };

  const fallbackResponse = (q: string) => {
    const qL = q.toLowerCase();
    let ans = '';
    let src = 'School Policy Manual';

    if (qL.includes('fee')) {
      ans = 'Tuition fees must be deposited by the 10th of every month. Payments can be completed online via Razorpay through the Parent Portal or at the fee counter. Late fees of ₹10 per day apply after the grace period of 10 days.';
      src = 'Approved Fee Guidelines 2026-27';
    } else if (qL.includes('timing') || qL.includes('time')) {
      ans = 'Summer Timings are 7:30 AM to 1:30 PM. Winter Timings are 8:30 AM to 2:30 PM. School runs Monday through Saturday (Second Saturdays are holidays).';
      src = 'Academic Schedule';
    } else if (qL.includes('grade') || qL.includes('grading') || qL.includes('cbse')) {
      ans = 'A. P PUBLIC SCHOOL follows CBSE 9-point grading: A1 (91-100%), A2 (81-90%), B1 (71-80%), B2 (61-70%), C1 (51-60%), C2 (41-50%), D (33-40%), E (Needs improvement). Minimum pass mark is 33%.';
      src = 'CBSE Evaluation Framework';
    } else {
      ans = 'A. P PUBLIC SCHOOL is located behind P.N.B. Bank, Naya Bus Stand Road, Baruasagar, Jhansi (UP). Classes operate from Nursery to Class 8. For administrative assistance, contact the Principal office at +91-6306262479.';
      src = 'School Directory';
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: ans,
        source: src,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="AI School Assistant (RAG Knowledge Engine)" />

        <main className="p-3.5 sm:p-6 pb-24 md:pb-8 max-w-4xl w-full mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 rounded-2xl bg-indigo-950 text-white shadow-md flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-900 flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">APPS Intelligent Assistant</h3>
                <p className="text-[11px] text-teal-300">Privacy-enforced RAG • A. P PUBLIC SCHOOL</p>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-800 text-indigo-200 border border-indigo-700 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Role-Protected Access</span>
            </span>
          </div>

          {/* Prompt Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            <button
              onClick={() => sendMessage('What is the school fee payment rule?')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              💳 What is the fee payment rule?
            </button>
            <button
              onClick={() => sendMessage('What are school timings?')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              ⏰ What are school timings?
            </button>
            <button
              onClick={() => sendMessage('How does CBSE 9-point grading work?')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              📊 How does CBSE 9-point grading work?
            </button>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'
                    }`}
                  >
                    {m.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.source && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-teal-700 font-semibold flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Source: {m.source}</span>
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 block mt-1 text-right">{m.time}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-slate-400 italic flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  <span>AI Assistant is consulting approved school documents...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about school fees, admission guidelines, CBSE grading, or timings..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={() => sendMessage()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
