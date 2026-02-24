import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getBanks } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    pin: '',
    confirmPin: '',
    name: '',
    referrer: '',
    bank: '',
    accountName: '',
    accountNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchBanks = async () => {
    setLoading(true);
    const res = await getBanks(true);
    setLoading(false);
    if (res.success) {
      setBanks(res.data);
    } else {
      setError('ไม่สามารถโหลดข้อมูลธนาคารได้');
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.pin !== formData.confirmPin) {
      setError('รหัส PIN ไม่ตรงกัน');
      return;
    }
    if (step === 1) {
      fetchBanks();
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register({
      phone: formData.phone,
      pin: formData.pin,
      name: formData.name,
      referrer: formData.referrer,
      bankName: formData.bank,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber
    });
    setLoading(false);

    if (res.success) {
      localStorage.setItem('th_lotto_user', JSON.stringify(res.data));
      navigate('/home');
    } else {
      setError(res.error || 'การสมัครสมาชิกผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light/20 flex items-center justify-center p-4 relative overflow-hidden font-prompt">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px]"></div>

      {loading && <Loader />}

      <div className="animate-fade-in-up bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-md relative z-10 border border-slate-100">
        <button
          onClick={() => step === 1 ? navigate('/login') : setStep(1)}
          className="absolute top-8 left-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-primary hover:bg-white hover:shadow-md transition-all active:scale-95"
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-brand-dark tracking-tight">สมัครสมาชิก</h2>
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step === 1 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
            <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step === 2 ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">ขั้นตอนที่ {step} จาก 2</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">เบอร์โทรศัพท์</label>
              <div className="relative">
                <i className="fas fa-mobile-alt absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                <input type="tel" name="phone" placeholder="08X-XXX-XXXX" required value={formData.phone} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-slate-700 shadow-inner" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">รหัส PIN</label>
                <div className="relative">
                  <i className="fas fa-key absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                  <input type="password" name="pin" maxLength="4" placeholder="••••" required value={formData.pin} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold tracking-[0.5em] text-slate-700 shadow-inner" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">ยืนยัน PIN</label>
                <div className="relative">
                  <i className="fas fa-check-circle absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                  <input type="password" name="confirmPin" maxLength="4" placeholder="••••" required value={formData.confirmPin} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold tracking-[0.5em] text-slate-700 shadow-inner" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">ชื่อ-นามสกุล</label>
              <div className="relative">
                <i className="fas fa-user absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                <input type="text" name="name" placeholder="ชื่อตามหน้าบุ๊คแบงค์" required value={formData.name} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-slate-700 shadow-inner" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">รหัสแนะนำ (ถ้ามี)</label>
              <div className="relative">
                <i className="fas fa-user-friends absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                <input type="text" name="referrer" placeholder="REF-XXXX" value={formData.referrer} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-slate-700 shadow-inner" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-gradient text-white font-black py-4 rounded-[2rem] shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 text-lg mt-4">ขั้นตอนถัดไป</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">เลือกธนาคาร</label>
              <div className="relative">
                <i className="fas fa-university absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                <select name="bank" required value={formData.bank} onChange={handleChange} className="w-full pl-14 pr-12 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none transition-all font-bold text-slate-700 shadow-inner">
                  <option value="" disabled>คลิกเพื่อเลือกธนาคาร</option>
                  {banks.map((bank, idx) => (
                    <option key={idx} value={bank['ชื่อธนาคาร']}>{bank['ชื่อธนาคาร']}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-300 pointer-events-none"></i>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">ชื่อบัญชี</label>
              <div className="relative">
                <i className="fas fa-file-signature absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                <input type="text" name="accountName" placeholder="ต้องตรงกับชื่อที่สมัคร" required value={formData.accountName} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-slate-700 shadow-inner" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">เลขที่บัญชี</label>
              <div className="relative">
                <i className="fas fa-money-check absolute top-1/2 left-5 transform -translate-y-1/2 text-brand-primary/40"></i>
                <input type="text" name="accountNumber" placeholder="XXXX-XXXX-XX" required value={formData.accountNumber} onChange={handleChange} className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-slate-700 shadow-inner" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-gradient text-white font-black py-4 rounded-[2rem] shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 text-lg mt-4">ยืนยันการสมัครสมาชิก</button>
          </form>
        )}
      </div>

      {error && (
        <Modal
          isOpen={!!error}
          onClose={() => setError(null)}
          title="แจ้งเตือน"
          actions={<button onClick={() => setError(null)} className="w-full py-4 bg-brand-primary text-white rounded-[1.5rem] font-black shadow-lg shadow-brand-primary/20">ตกลง</button>}
        >
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="text-slate-800 font-black text-xl mb-2">สมัครสมาชิกไม่สำเร็จ</div>
            <p className="text-slate-500 font-medium">{error}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Register;
