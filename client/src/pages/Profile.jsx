import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, ShieldCheck, Calendar, LogOut, User, Save, X, Pencil } from 'lucide-react';

export const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await updateUser(formData);
      if (!res.success) {
        setError(res.message || 'Profile update failed.');
        return;
      }
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setError('');
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Student Profile</h1>
        <p className="text-xs text-slate-400">Manage account information & pre-order preferences</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full gradient-bg text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {user?.role || 'Student'} Account
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <User className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="w-full">
              <span className="text-xs text-slate-400 block font-medium">Full Name</span>
              {editing ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              ) : (
                <span className="font-semibold text-white">{user?.name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="w-full">
              <span className="text-xs text-slate-400 block font-medium">Email Address</span>
              {editing ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              ) : (
                <span className="font-semibold text-white">{user?.email}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="w-full">
              <span className="text-xs text-slate-400 block font-medium">Contact Phone</span>
              {editing ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              ) : (
                <span className="font-semibold text-white">{user?.phone || 'Not provided'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Account Status</span>
              <span className="font-semibold text-emerald-400">Active Campus Student</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          <button
            onClick={logout}
            className="px-6 py-3 rounded-2xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
