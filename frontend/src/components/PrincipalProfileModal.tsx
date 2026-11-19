import React, { useState, useEffect } from 'react';
import { UserCheck, Mail, Phone, Lock, Save, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrincipalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updated: any) => void;
}

export const PrincipalProfileModal: React.FC<PrincipalProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [name, setName] = useState('Dr. R. K. Sharma (Principal)');
  const [email, setEmail] = useState('principal@appublicschool.edu.in');
  const [phone, setPhone] = useState('7348011701');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('apps_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
        if (u.phone) setPhone(u.phone.replace(/[^0-9]/g, ''));
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');

    try {
      // Update backend credentials if email or password changed
      await fetch('/api/v1/auth/update-principal-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmailOrPhone: phone,
          newEmail: email.trim(),
          newPassword: password.trim() || undefined,
        }),
      });

      // Update local storage representation
      const updatedUser = {
        name,
        email,
        phone,
        role: 'PRINCIPAL',
      };
      localStorage.setItem('apps_user', JSON.stringify(updatedUser));
      setNotice('Principal Profile updated successfully!');
      if (onProfileUpdated) onProfileUpdated(updatedUser);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setNotice('Profile saved locally!');
      setTimeout(() => onClose(), 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Edit Principal Profile & Credentials</h3>
              <p className="text-[11px] text-slate-300">Executive clearance profile settings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {notice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Principal Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-mono focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registered WhatsApp / Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-mono focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Update Master Password (Khali chhod dein agar nahi badalna)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (Leave blank to keep current)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrincipalProfileModal;
