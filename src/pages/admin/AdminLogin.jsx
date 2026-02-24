import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import Loader from '../../components/Loader';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminLogin(username, password);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('th_lotto_user', JSON.stringify({ ...res.data, role: 'admin' }));
      navigate('/admin/dashboard');
    } else {
      alert('Login Failed: รหัสผ่านไม่ถูกต้อง');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-prompt relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-secondary/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="animate-fade-in-up bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10 relative z-10">
        <div className="text-center mb-10">
          <img src="https://img2.pic.in.th/pic/TH-LOTTO.md.png" alt="Logo" className="w-20 h-20 rounded-3xl mx-auto mb-4 border-2 border-white/10 p-2 bg-gradient-to-br from-white/5 to-transparent" />
          <h1 className="text-3xl font-black text-white tracking-tighter">ADMIN CONTROL</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Secure Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Username</label>
            <div className="relative">
              <i className="fas fa-shield-alt absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/40"></i>
              <input
                type="text"
                placeholder="Manager ID"
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all shadow-inner"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/40"></i>
              <input
                type="password"
                placeholder="Secret Key"
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all shadow-inner"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="w-full bg-brand-gradient text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all active:scale-95 mt-4">
            Authorize & Access
          </button>
        </form>

        <div className="mt-10 text-center">
          <button onClick={() => navigate('/home')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
