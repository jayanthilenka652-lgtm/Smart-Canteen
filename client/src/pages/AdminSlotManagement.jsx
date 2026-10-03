import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { Layers, Plus, Edit3, Trash2, Clock, Users, Check, X } from 'lucide-react';

export const AdminSlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Morning',
    date: new Date().toISOString().split('T')[0],
    startTime: '7:30 AM',
    endTime: '10:30 AM',
    capacity: 25,
    isActive: true
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/slots');
      if (res.success && res.data) {
        setSlots(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormData({
      category: 'Morning',
      date: new Date().toISOString().split('T')[0],
      startTime: '7:30 AM',
      endTime: '10:30 AM',
      capacity: 25,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      category: slot.category || 'Morning',
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      isActive: slot.isActive
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await api.put(`/slots/${editingSlot._id}`, formData);
      } else {
        await api.post('/slots', formData);
      }
      setIsModalOpen(false);
      fetchSlots();
    } catch (err) {
      alert(err.message || 'Failed to save slot');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pickup slot?')) return;
    try {
      await api.delete(`/slots/${id}`);
      fetchSlots();
    } catch (err) {
      alert(err.message || 'Failed to delete slot');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Pickup Slot Capacity Control</h1>
          <p className="text-xs text-slate-400">Configure arrival windows & maximum order capacity to eliminate queues</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl font-bold text-xs text-white gradient-bg flex items-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4" /> Create Pickup Slot
        </button>
      </div>

      {loading ? (
        <Loader label="Loading pickup slots..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => {
            const isFull = slot.bookedCount >= slot.capacity;

            return (
              <div
                key={slot._id}
                className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {slot.category || 'Pickup'}
                    </span>
                    <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      {slot.startTime} - {slot.endTime}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    slot.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {slot.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Booked Capacity</span>
                    <span className="font-extrabold text-white text-base flex items-center gap-1">
                      <Users className="w-4 h-4 text-indigo-400" /> {slot.bookedCount} / {slot.capacity}
                    </span>
                  </div>

                  {isFull && (
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold text-xs uppercase">
                      FULL
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenEdit(slot)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slot._id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingSlot ? 'Edit Pickup Slot' : 'Create Pickup Slot'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="7:30 AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:30 AM"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Maximum Order Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeSlot"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-indigo-500 w-4 h-4"
                />
                <label htmlFor="activeSlot" className="text-slate-300 font-semibold">Enable slot for bookings</label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-bg text-white font-bold"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlotManagement;
