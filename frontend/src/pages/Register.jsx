import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Create account 🚀</h2>
        <p className="text-slate-400 mb-6">Start tracking your finances</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'password'].map(field => (
            <div key={field}>
              <label className="text-sm text-slate-400 mb-1 block capitalize">{field}</label>
              <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors">Create Account</button>
        </form>
        <p className="text-slate-400 text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}