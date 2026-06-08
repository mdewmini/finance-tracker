import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const defaultColors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
const emptyForm = { name: '', type: 'expense', color: '#6366f1' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetch = () => api.get('/categories').then(r => setCategories(r.data));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, type: c.type, color: c.color }); setEditId(c._id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/categories/${editId}`, form); toast.success('Updated!'); }
      else { await api.post('/categories', form); toast.success('Created!'); }
      setShowModal(false); fetch();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const income = categories.filter(c => c.type === 'income');
  const expense = categories.filter(c => c.type === 'expense');

  const CategoryList = ({ items, label }) => (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <h2 className="font-semibold text-white mb-4">{label} Categories</h2>
      <div className="space-y-2">
        {items.map(c => (
          <div key={c._id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-white text-sm">{c.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="p-1 rounded text-slate-400 hover:text-primary transition-colors"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(c._id)} className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No categories</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryList items={income} label="Income" />
        <CategoryList items={expense} label="Expense" />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Add'} Category</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Name</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Type</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Color</label>
                <div className="flex gap-2">
                  {defaultColors.map(c => (
                    <button type="button" key={c} onClick={() => setForm({ ...form, color: c })} className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}