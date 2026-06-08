import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const now = new Date();
const emptyForm = { category: '', amount: '', month: now.getMonth() + 1, year: now.getFullYear() };

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const fetchData = async () => {
    const [bRes, cRes] = await Promise.all([api.get(`/budgets?month=${month}&year=${year}`), api.get('/categories')]);
    setBudgets(bRes.data);
    setCategories(cRes.data.filter(c => c.type === 'expense'));
  };

  useEffect(() => { fetchData(); }, [month, year]);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (b) => { setForm({ category: b.category, amount: b.amount, month: b.month, year: b.year }); setEditId(b._id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/budgets/${editId}`, form); toast.success('Updated!'); }
      else { await api.post('/budgets', form); toast.success('Created!'); }
      setShowModal(false); fetchData();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete budget?')) return;
    try { await api.delete(`/budgets/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Budgets</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Budget
        </button>
      </div>

      <div className="flex gap-3">
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={month} onChange={e => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
        </select>
        <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-24" value={year} onChange={e => setYear(Number(e.target.value))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {budgets.map(b => {
          const pct = Math.min((b.spent / b.amount) * 100, 100);
          const over = b.spent > b.amount;
          return (
            <div key={b._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">{b.category}</p>
                  <p className="text-slate-500 text-xs">{b.month}/{b.year} • Monthly</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(b._id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-400/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Spent: <span className={over ? 'text-red-400 font-semibold' : 'text-white'}>${b.spent?.toFixed(2)}</span></span>
                <span className="text-slate-400">Budget: <span className="text-white">${b.amount.toFixed(2)}</span></span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full">
                <div className={`h-2.5 rounded-full transition-all ${over ? 'bg-red-500' : pct > 75 ? 'bg-yellow-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
              </div>
              {over && <p className="text-red-400 text-xs mt-2 font-medium">⚠️ Over budget by ${(b.spent - b.amount).toFixed(2)}</p>}
              <p className="text-slate-500 text-xs mt-1">{pct.toFixed(0)}% used</p>
            </div>
          );
        })}
        {budgets.length === 0 && <p className="text-slate-500 col-span-2 text-center py-10">No budgets for this period</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Create'} Budget</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Budget Amount</label>
                <input type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Month</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.month} onChange={e => setForm({ ...form, month: Number(e.target.value) })}>
                    {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Year</label>
                  <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} required />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">Save Budget</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}