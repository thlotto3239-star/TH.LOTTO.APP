import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(phone, pin);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('th_lotto_user', JSON.stringify(res.data));
      navigate('/home');
    } else {
      setError(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light/20 relative overflow-hidden font-prompt">
      {/* Background Decorators */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="animate-fade-in-up bg-white rounded-[3rem] p-10 shadow-2xl w-full max-w-sm relative z-10 border border-slate-100 mx-4">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full scale-110"></div>
            <img src="https://img2.pic.in.th/pic/TH-LOTTO.md.png" alt="Logo" className="relative w-28 h-28 mx-auto rounded-full shadow-2xl border-4 border-white" />
          </div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter">TH-LOTTO</h1>
          <p className="text-slate-400 text-sm mt-3 font-bold tracking-widest uppercase">Premium Lottery Service</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">เบอร์โทรศัพท์</label>
            <div className="relative">
              <i className="fas fa-phone-alt absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
              <input
                type="tel"
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-slate-700 shadow-inner"
                placeholder="08X-XXX-XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">รหัส PIN (4 หลัก)</label>
            <div className="relative">
              <i className="fas fa-lock absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
              <input
                type="password"
                maxLength="4"
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold tracking-[1em] text-lg text-slate-700 shadow-inner"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-gradient text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 text-lg"
          >
            เข้าสู่ระบบทันที
          </button>
        </form>

        <div className="mt-10 text-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">หรือ</span>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="w-full text-brand-primary font-black text-sm py-4 rounded-[1.5rem] bg-slate-50 hover:bg-slate-100 transition-all active:scale-95"
          >
            เปิดบัญชีใหม่ตอนนี้
          </button>
        </div>
      </div>

      {error && (
        <Modal
          isOpen={!!error}
          onClose={() => setError(null)}
          title="แจ้งเตือน"
          actions={<button onClick={() => setError(null)} className="w-full py-4 bg-brand-primary text-white rounded-[1.5rem] font-black shadow-lg shadow-brand-primary/20 animate-pulse">เข้าใจแล้ว</button>}
        >
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="text-slate-800 font-black text-xl mb-2">ไม่สามารถเข้าสู่ระบบได้</div>
            <p className="text-slate-500 font-medium">{error}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Login;
