import { useState, useEffect } from 'react';
import api from '../services/api';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    api.get('/transactions').then(r => setTransactions(r.data));
    const now = new Date();
    api.get(`/budgets?month=${now.getMonth() + 1}&year=${now.getFullYear()}`).then(r => setBudgets(r.data));
  }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // Expense by category
  const expenseByCategory = Object.entries(
    transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Monthly data (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth(); const y = d.getFullYear();
    const inc = transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() === m && new Date(t.date).getFullYear() === y).reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === m && new Date(t.date).getFullYear() === y).reduce((s, t) => s + t.amount, 0);
    return { month: d.toLocaleString('default', { month: 'short' }), Income: inc, Expense: exp };
  });

  const summary = [
    { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Expenses', value: expense, icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Balance', value: balance, icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Budgets', value: budgets.length, icon: PiggyBank, color: 'text-yellow-400', bg: 'bg-yellow-400/10', noFormat: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map(({ label, value, icon: Icon, color, bg, noFormat }) => (
          <div key={label} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon className={color} size={20} />
            </div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>
              {noFormat ? value : `$${value.toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bar Chart */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h2 className="font-semibold text-white mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
              <Legend />
              <Bar dataKey="Income" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Pie Chart */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h2 className="font-semibold text-white mb-4">Expense Distribution</h2>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-center mt-16">No expense data</p>}
        </div>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h2 className="font-semibold text-white mb-4">Budget Progress</h2>
          <div className="space-y-4">
            {budgets.map(b => {
              const pct = Math.min((b.spent / b.amount) * 100, 100);
              const over = b.spent > b.amount;
              return (
                <div key={b._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{b.category}</span>
                    <span className={over ? 'text-red-400 font-semibold' : 'text-slate-400'}>
                      ${b.spent.toFixed(2)} / ${b.amount.toFixed(2)} {over && '⚠️ Over budget!'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full">
                    <div className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h2 className="font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(t => (
            <div key={t._id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div>
                <p className="text-white text-sm font-medium">{t.title}</p>
                <p className="text-slate-500 text-xs">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
              <span className={`font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-slate-500 text-center py-4">No transactions yet</p>}
        </div>
      </div>
    </div>
  );
}