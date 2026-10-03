import React, { useEffect, useState } from 'react';
import { Check, Edit3, Plus, Trash2, X } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const blankCombo = {
  name: '',
  description: '',
  price: '',
  image: '',
  isAvailable: true,
  items: []
};

export const AdminComboManagement = () => {
  const [combos, setCombos] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(blankCombo);
  const [selectedFood, setSelectedFood] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/combos'), api.get('/foods')])
      .then(([comboResponse, foodResponse]) => {
        setCombos(comboResponse.data || []);
        setFoods(foodResponse.data || []);
      })
      .catch((err) => setError(err.message || 'Combo management data could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const refreshCombos = async () => {
    const response = await api.get('/combos');
    setCombos(response.data || []);
  };

  const beginAdd = () => {
    setEditingCombo(null);
    setFormOpen(true);
    setForm(blankCombo);
    setSelectedFood('');
    setItemQuantity(1);
    setError('');
  };

  const beginEdit = (combo) => {
    setEditingCombo(combo);
    setFormOpen(true);
    setForm({
      name: combo.name,
      description: combo.description || '',
      price: combo.price,
      image: combo.image || '',
      isAvailable: combo.isAvailable,
      items: combo.items || []
    });
    setSelectedFood('');
    setItemQuantity(1);
    setError('');
  };

  const addIncludedFood = () => {
    if (!selectedFood) return;
    const quantity = Math.max(1, Number(itemQuantity) || 1);
    setForm((current) => ({
      ...current,
      items: [...current.items, { name: selectedFood, quantity }]
    }));
    setSelectedFood('');
    setItemQuantity(1);
  };

  const saveCombo = async (event) => {
    event.preventDefault();
    setError('');
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingCombo) await api.put(`/combos/${editingCombo._id}`, payload);
      else await api.post('/combos', payload);
      setEditingCombo(null);
      setFormOpen(false);
      setForm(blankCombo);
      await refreshCombos();
    } catch (err) {
      setError(err.message || 'Combo could not be saved.');
    }
  };

  const toggleAvailability = async (combo) => {
    try {
      await api.patch(`/combos/${combo._id}/availability`);
      await refreshCombos();
    } catch (err) {
      setError(err.message || 'Combo availability could not be changed.');
    }
  };

  const deleteCombo = async (combo) => {
    if (!window.confirm(`Delete ${combo.name}?`)) return;
    try {
      await api.delete(`/combos/${combo._id}`);
      await refreshCombos();
    } catch (err) {
      setError(err.message || 'Combo could not be deleted.');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Combo Management</h1>
          <p className="text-sm text-slate-400">Manage bundle items, pricing, images, and availability.</p>
        </div>
        <button type="button" onClick={beginAdd} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
          <Plus className="w-4 h-4" /> New Combo
        </button>
      </header>

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}

      {loading ? <Loader label="Loading combo offers..." /> : (
        <div className="overflow-x-auto border-y border-slate-800">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3 pr-4">Combo</th>
                <th className="py-3 pr-4">Included items</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Availability</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {combos.map((combo) => (
                <tr key={combo._id}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={combo.image} alt="" className="h-12 w-16 rounded-md object-cover bg-slate-800" />
                      <div><div className="font-semibold text-white">{combo.name}</div><div className="text-xs text-slate-400">{combo.description}</div></div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-xs">{(combo.items || []).map((item) => `${item.name} × ${item.quantity}`).join(', ')}</td>
                  <td className="py-4 pr-4 font-semibold">₹{combo.price}</td>
                  <td className="py-4 pr-4">
                    <button type="button" onClick={() => toggleAvailability(combo)} className={`inline-flex items-center gap-1.5 text-xs font-semibold ${combo.isAvailable ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {combo.isAvailable ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {combo.isAvailable ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-4 text-right whitespace-nowrap">
                    <button type="button" onClick={() => beginEdit(combo)} title="Edit combo" className="p-2 text-slate-300 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => deleteCombo(combo)} title="Delete combo" className="p-2 text-rose-300 hover:text-rose-200"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <form onSubmit={saveCombo} className="space-y-4 border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white">{editingCombo ? 'Edit Combo' : 'New Combo'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Combo name" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
            <input required type="number" min="1" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Combo price" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
            <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Short description" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
            <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="Image URL" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select value={selectedFood} onChange={(event) => setSelectedFood(event.target.value)} className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
              <option value="">Select an included food</option>
              {foods.map((food) => <option key={food._id} value={food.name}>{food.name}</option>)}
            </select>
            <input aria-label="Item quantity" type="number" min="1" value={itemQuantity} onChange={(event) => setItemQuantity(event.target.value)} className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
            <button type="button" onClick={addIncludedFood} disabled={!selectedFood} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-50">Add item</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.items.map((item, index) => (
              <button key={`${item.name}-${index}`} type="button" onClick={() => setForm({ ...form, items: form.items.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300">
                {item.name} × {item.quantity} <span aria-hidden="true" className="ml-1 text-rose-300">×</span>
              </button>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} /> Enabled for students
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={!form.items.length} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Save Combo</button>
            <button type="button" onClick={() => { setEditingCombo(null); setForm(blankCombo); setFormOpen(false); }} className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300">Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
};

export default AdminComboManagement;