'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  GraduationCap,
  BookOpen,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Hash,
  KeyRound,
  Clock,
  AlertTriangle,
  School
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'PARENT' | 'STUDENT' | 'TEACHER'>('TEACHER');

  const [formData, setFormData] = useState({
    name: '',
    teacherId: 'TCH-2026-01',
    email: '',
    phone: '',
    password: '',
    className: 'Class 4',
    sectionName: 'A',
    rollNumber: '',
    childName: '',
    subject: 'Mathematics & Science',
  });

  // OTP State for Class Teacher
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Status & Completion State
  const [loading, setLoading] = useState(false);
  const [registeredPendingUser, setRegisteredPendingUser] = useState<any | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send 1-Time OTP to Teacher's Mobile
  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError('Kripya valid 10-digit mobile number enter karein OTP prapt karne ke liye.');
      return;
    }
    setError('');
    setSendingOtp(true);

    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setGeneratedOtp(data.otp);
        setSuccess(`1-Time OTP successfully sent to ${formData.phone}!`);
      } else {
        setError(data.message || 'OTP send karne me samasya aayi.');
      }
    } catch (e) {
      setError('Server se connect nahi ho paya. Kripya check karein.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Register Teacher with OTP & Submit for Admin Approval
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Teacher requires OTP verification
    if (role === 'TEACHER') {
      if (!otpSent) {
        setError('Pehle "Send 1-Time OTP" par click karein aur OTP verify karein.');
        return;
      }
      if (!enteredOtp || enteredOtp.length !== 6) {
        setError('Kripya 6-digit OTP code enter karein.');
        return;
      }
    }

    setLoading(true);

    try {
      let endpoint = '/api/v1/auth/register';
      let payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        className: formData.className,
        sectionName: formData.sectionName,
      };

      if (role === 'TEACHER') {
        endpoint = '/api/v1/auth/register-teacher';
        payload = {
          teacherId: formData.teacherId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          assignedClass: formData.className,
          assignedSection: formData.sectionName,
          subject: formData.subject,
          otp: enteredOtp,
        };
      } else if (role === 'STUDENT') {
        payload.rollNumber = formData.rollNumber || '1';
      } else if (role === 'PARENT') {
        payload.childName = formData.childName;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (role === 'TEACHER' || data.pendingApproval) {
          setRegisteredPendingUser(data.user || payload);
          setSuccess('Account submitted successfully! Pending approval from School Admin / Principal.');
        } else {
          setSuccess(`Registration successful as ${role}! Redirecting to login...`);
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } else {
        setError(data.message || 'Registration failed. Please check details.');
      }
    } catch (err: any) {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 py-8 relative overflow-hidden text-white selection:bg-teal-500 selection:text-white">
      {/* Background Lighting Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-teal-500/20 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-7 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 mb-2.5 ring-2 ring-indigo-400/20">
            AP
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">A. P PUBLIC SCHOOL, JHANSI</h1>
          <p className="text-xs text-teal-400 font-semibold mt-0.5">CBSE Affiliation Portal • User Registration</p>
        </div>

        {/* Post-Registration Success & Pending Admin Approval Screen */}
        {registeredPendingUser ? (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                1-Time OTP Verified • Pending Admin Approval
              </span>
              <h2 className="text-lg font-black text-white mt-2">
                Teacher Registration Submitted!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Aapka registration request successfully submit ho gaya hai.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Teacher Name:</span>
                <span className="font-bold text-white">{registeredPendingUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Manual User ID / Teacher ID:</span>
                <span className="font-mono font-bold text-teal-400">{registeredPendingUser.teacherId || registeredPendingUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Class & Section:</span>
                <span className="font-bold text-indigo-300">{registeredPendingUser.className || registeredPendingUser.assignedClass} - Section {registeredPendingUser.sectionName || registeredPendingUser.assignedSection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Mobile:</span>
                <span className="font-bold text-slate-200">{registeredPendingUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OTP Status:</span>
                <span className="text-emerald-400 font-bold">✓ 1-Time OTP Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Approval Status:</span>
                <span className="text-amber-400 font-bold">PENDING_APPROVAL (Admin / Principal)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center space-x-2 text-left">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Zaroori Suchna:</strong> School Admin / Principal dwara approve karne ke baad hi aap is User ID aur Password se login kar sakenge.
              </span>
            </div>

            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg inline-flex items-center justify-center space-x-2"
            >
              <span>Go to Login Screen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Role Selector Tabs */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Select Your Role to Register
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    role === 'TEACHER'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Class Teacher</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('PARENT')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    role === 'PARENT'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Parent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    role === 'STUDENT'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </button>
              </div>
            </div>

            {success && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name & Teacher ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {role === 'TEACHER' ? "Teacher's Full Name *" : role === 'PARENT' ? "Parent's Full Name *" : "Student's Full Name *"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 transition-all placeholder-slate-500"
                      placeholder={role === 'TEACHER' ? 'e.g. Smt. Sunita Sharma' : role === 'PARENT' ? 'e.g. Manoj Sharma' : 'e.g. Rishi Verma'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {role === 'TEACHER' ? 'Manual Teacher ID / User ID *' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name={role === 'TEACHER' ? 'teacherId' : 'email'}
                      value={role === 'TEACHER' ? formData.teacherId : formData.email}
                      onChange={handleChange}
                      required={role === 'TEACHER'}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 transition-all placeholder-slate-500"
                      placeholder={role === 'TEACHER' ? 'e.g. TCH-2026-01' : 'name@example.com'}
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {role === 'TEACHER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 transition-all placeholder-slate-500"
                        placeholder="teacher@appublicschool.edu.in"
                      />
                    </div>
                  </div>
                )}

                <div className={role !== 'TEACHER' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Phone Number (For 1-Time OTP) *
                  </label>
                  <div className="relative flex space-x-2">
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 transition-all placeholder-slate-500"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    {role === 'TEACHER' && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendingOtp}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md"
                      >
                        {sendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send 1-Time OTP'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 1-Time OTP Verification Section (For Class Teacher) */}
              {role === 'TEACHER' && (
                <div className={`p-4 rounded-2xl border transition-all ${otpSent ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">1-Time OTP Verification</span>
                    </div>
                    {otpSent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        OTP Active
                      </span>
                    )}
                  </div>

                  {otpSent ? (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
                        <span>Demo OTP Code: <strong className="font-mono text-base text-amber-300 tracking-wider ml-1">{generatedOtp}</strong></span>
                        <span className="text-[10px] text-slate-400">Valid for 10 min</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Enter 6-Digit OTP Received on Mobile</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full text-center text-lg tracking-[0.4em] font-mono py-2 rounded-xl bg-slate-950 border border-amber-500/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                          placeholder="______"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Class teacher registration secure karne ke liye pehle apna mobile number enter karein aur &apos;Send 1-Time OTP&apos; dabayein.
                    </p>
                  )}
                </div>
              )}

              {/* Class & Section Assignment */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-3">
                <span className="text-[11px] font-bold text-indigo-300 flex items-center space-x-1">
                  <School className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {role === 'TEACHER' ? 'Classroom Incharge Allocation:' : role === 'STUDENT' ? 'Class & Roll No Allocation:' : 'Child Enrollment Class:'}
                  </span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-300 mb-1">Assigned Class *</label>
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full py-1.5 px-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                    >
                      {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-300 mb-1">Assigned Section *</label>
                    <select
                      name="sectionName"
                      value={formData.sectionName}
                      onChange={handleChange}
                      className="w-full py-1.5 px-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500 transition-all placeholder-slate-500"
                    placeholder="Choose a strong password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Submitting & Saving...'
                    : role === 'TEACHER'
                    ? 'Verify OTP & Submit for Admin Approval'
                    : `Register as ${role}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Already registered and approved?{' '}
                <Link href="/login" className="text-teal-400 font-bold hover:underline">
                  Sign In to School Portal
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
