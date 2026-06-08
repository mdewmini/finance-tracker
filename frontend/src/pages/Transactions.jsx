import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const empty = { title: '', amount: '', category: '', type: 'expense', date: new Date().toISOString().split('T')[0], note: '' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '', type: '' });
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const [txRes, catRes] = await Promise.all([api.get('/transactions', { params }), api.get('/categories')]);
    setTransactions(txRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => { fetchData(); }, [filters]);

  const openAdd = () => { setForm(empty); setEditId(null); setShowModal(true); };
  const openEdit = (t) => { setForm({ ...t, date: t.date.split('T')[0] }); setEditId(t._id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/transactions/${editId}`, form); toast.success('Updated!'); }
      else { await api.post('/transactions', form); toast.success('Added!'); }
      setShowModal(false); fetchData();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try { await api.delete(`/transactions/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <input type="date" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} placeholder="Start date" />
        <input type="date" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-800">
            <tr className="text-slate-400 text-sm">
              {['Title', 'Amount', 'Category', 'Type', 'Date', 'Note', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white text-sm font-medium">{t.title}</td>
                <td className={`px-4 py-3 font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-300 text-sm">{t.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.type === 'income' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">{t.note || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-400/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={7} className="text-center text-slate-500 py-10">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Add'} Transaction</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[['title', 'Title', 'text'], ['amount', 'Amount', 'number'], ['date', 'Date', 'date']].map(([field, label, type]) => (
                <div key={field}>
                  <label className="text-sm text-slate-400 mb-1 block">{label}</label>
                  <input type={type} step={field === 'amount' ? '0.01' : undefined} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
                </div>
              ))}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Type</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.filter(c => c.type === form.type).map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Note (optional)</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}