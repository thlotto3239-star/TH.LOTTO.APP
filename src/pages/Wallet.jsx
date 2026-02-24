import React, { useEffect, useState } from 'react';
import { getWalletPageData, createTransaction, updateTransactionDetails, getSystemBankDetails } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/format';

const IMGBB_API_KEY = '8e158836403df86adce925f6108ebea0';

const Wallet = () => {
  const [data, setData] = useState(null);
  const [view, setView] = useState('main'); // main, deposit_amount, deposit_qr, deposit_upload, withdraw
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(true);
  const [systemBank, setSystemBank] = useState(null);
  const [currentTxId, setCurrentTxId] = useState(null);

  // Upload State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [transferTime, setTransferTime] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('th_lotto_user'));
    const res = await getWalletPageData(user.userId);
    if (res.success) setData(res.data);
    setLoading(false);
  };

  const handleKeypad = (val) => {
    if (val === 'del') setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    else setAmount(prev => prev === '0' ? val : prev + val);
  };

  const startDeposit = async () => {
    setLoading(true);
    const bankRes = await getSystemBankDetails();
    if (bankRes.success) setSystemBank(bankRes.data);
    setLoading(false);
    setView('deposit_amount');
    setAmount('0');
  };

  const confirmDepositAmount = async () => {
    const val = parseFloat(amount);
    if (val <= 0) return alert('กรุณาระบุจำนวนเงิน');

    setLoading(true);
    const user = JSON.parse(localStorage.getItem('th_lotto_user'));
    const res = await createTransaction({ userId: user.userId, type: 'deposit', amount: val });
    setLoading(false);

    if (res.success) {
      setCurrentTxId(res.transactionId);
      setView('deposit_qr');
    } else {
      alert(res.error);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  const submitUpload = async () => {
    if (!file || !transferTime) return alert('กรุณาแนบสลิปและระบุเวลาที่โอน');

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const imgData = await imgRes.json();

      if (imgData.success) {
        const updateRes = await updateTransactionDetails({
          transactionId: currentTxId,
          slipUrl: imgData.data.url,
          transferTime: transferTime
        });

        if (updateRes.success) {
          alert('แจ้งฝากเงินสำเร็จ กรุณารอระบบตรวจสอบสักครู่');
          setView('main');
          fetchData();
        } else {
          alert('อัปเดตข้อมูลไม่สำเร็จ: ' + updateRes.error);
        }
      } else {
        alert('อัปโหลดรูปภาพไม่สำเร็จ');
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const submitWithdraw = async () => {
    const val = parseFloat(amount);
    if (val <= 0) return alert('กรุณาระบุจำนวนเงิน');
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('th_lotto_user'));
    const res = await createTransaction({ userId: user.userId, type: 'withdraw', amount: val });
    setLoading(false);
    if (res.success) {
      alert('แจ้งถอนเงินสำเร็จ');
      setView('main');
      fetchData();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <Loader />;

  if (view === 'main') {
    return (
      <div className="pb-24 px-4 bg-brand-light/20 min-h-screen pt-4 space-y-8 font-prompt">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">กระเป๋าเงิน</h1>
          <div className="h-1 w-12 bg-brand-primary rounded-full mt-1"></div>
        </div>

        <div className="animate-fade-in-up bg-brand-gradient p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl rotate-12 group-hover:rotate-45 transition-transform duration-700">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Total Balance</p>
            <h1 className="text-5xl font-black tracking-tighter mb-8 drop-shadow-md">
              <span className="text-2xl mr-1 opacity-60">฿</span>
              {data?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>
            <div className="flex gap-4">
              <button onClick={startDeposit} className="flex-1 bg-white/20 hover:bg-white/30 p-4 rounded-2xl font-black text-xs uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                <i className="fas fa-plus-circle text-lg"></i> ฝากเงิน
              </button>
              <button onClick={() => { setView('withdraw'); setAmount('0'); }} className="flex-1 bg-white/20 hover:bg-white/30 p-4 rounded-2xl font-black text-xs uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                <i className="fas fa-arrow-circle-up text-lg"></i> ถอนเงิน
              </button>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up delay-100 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50">
          <h3 className="font-black text-brand-dark text-lg mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
            ประวัติธุรกรรมล่าสุด
          </h3>
          <div className="space-y-4">
            {data?.history?.length > 0 ? data.history.map((h, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform ${h.type === 'deposit' ? 'bg-green-100 text-green-600' : (h.type === 'withdraw' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600')}`}>
                    <i className={`fas ${h.type === 'deposit' ? 'fa-plus' : (h.type === 'withdraw' ? 'fa-minus' : 'fa-receipt')}`}></i>
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">{h.type === 'deposit' ? 'ฝากเงิน' : (h.type === 'withdraw' ? 'ถอนเงิน' : 'เดิมพัน')}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{h.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black tracking-tight ${h.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                    {h.type === 'deposit' ? '+' : '-'}{h.amount?.toLocaleString()}
                  </p>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${h.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {h.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <i className="fas fa-history text-slate-100 text-5xl mb-4"></i>
                <p className="text-slate-400 font-bold tracking-wider">ยังไม่มีประวัติการทำรายการ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'deposit_amount' || view === 'withdraw') {
    return (
      <div className="pb-24 px-4 bg-brand-light/20 min-h-screen pt-8 space-y-8 font-prompt animate-fade-in-up">
        <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-md active:scale-95"><i className="fas fa-arrow-left"></i></button>
        <div className="text-center">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">{view === 'deposit_amount' ? 'ระบุยอดฝาก' : 'ระบุยอดถอน'}</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{view === 'deposit_amount' ? 'ระบุจำนวนเงินที่ต้องการโอนเข้าสู่ระบบ' : 'ถอนเงินเข้าบัญชีธนาคารที่คุณลงทะเบียนไว้'}</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-gradient"></div>
          <div className="text-6xl font-black text-brand-primary tracking-tighter mb-12 flex items-center justify-center gap-2">
            <span className="text-2xl opacity-30">฿</span>
            {parseFloat(amount).toLocaleString()}
          </div>

          <div className="grid grid-cols-3 gap-5 max-w-sm mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0].map(k => (
              <button
                key={k}
                onClick={() => k === 'del' ? handleKeypad('del') : handleKeypad(String(k))}
                className={`h-16 rounded-2xl font-black text-2xl transition-all flex items-center justify-center active:scale-90 ${k === 'del' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-700 hover:bg-white hover:shadow-md border border-slate-100'}`}
              >
                {k === 'del' ? <i className="fas fa-backspace"></i> : k}
              </button>
            ))}
            <button onClick={() => view === 'deposit_amount' ? confirmDepositAmount() : submitWithdraw()} className="bg-brand-primary text-white rounded-2xl font-black text-xl shadow-lg shadow-brand-primary/20 active:scale-95"><i className="fas fa-check"></i></button>
          </div>

          <div className="mt-12 flex gap-3">
            {[100, 500, 1000].map(v => (
              <button key={v} onClick={() => setAmount(String(parseFloat(amount) + v))} className="flex-1 bg-slate-50 border border-slate-100 py-3 rounded-xl text-xs font-black text-slate-500 hover:bg-brand-light hover:text-brand-primary transition-all">+{v}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'deposit_qr') {
    return (
      <div className="pb-24 px-4 bg-brand-light/20 min-h-screen pt-8 space-y-8 font-prompt animate-fade-in-up text-center">
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">สแกนเพื่อโอนเงิน</h1>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 space-y-8 max-w-md mx-auto">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ยอดเงินที่ต้องโอน</p>
            <h3 className="text-4xl font-black text-brand-primary tracking-tighter">฿{formatCurrency(amount)}</h3>
          </div>

          <div className="relative group p-4 bg-white border-4 border-slate-50 rounded-[2.5rem] shadow-inner inline-block">
            <img
              src={`https://promptpay.io/${systemBank?.promptpay}/${amount}`}
              alt="QR Code"
              className="w-56 h-56 object-contain relative z-10"
            />
            <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-lg font-black text-slate-800 tracking-tight">{systemBank?.accountName}</p>
            <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mt-1">{systemBank?.bankName} • PROMPTPAY</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setView('deposit_upload')}
              className="w-full bg-brand-gradient text-white font-black py-5 rounded-[2rem] shadow-xl shadow-brand-primary/20 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              โอนแล้ว แจ้งอัปโหลดสลิป
            </button>
            <button onClick={() => setView('main')} className="w-full text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">ยกเลิกรายการ</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'deposit_upload') {
    return (
      <div className="pb-24 px-4 bg-brand-light/20 min-h-screen pt-8 space-y-8 font-prompt animate-fade-in-up">
        <button onClick={() => setView('deposit_qr')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-md active:scale-95"><i className="fas fa-arrow-left"></i></button>
        <div className="text-center">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">ยืนยันหลักฐาน</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">กรุณาแนบสลิปโอนเงินเพื่ออัปเดตยอดเงินในระบบ</p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 space-y-8 max-w-md mx-auto">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 tracking-[0.2em]">เวลาที่โอน (ตามสลิป)</label>
            <div className="relative">
              <i className="far fa-clock absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40"></i>
              <input
                type="time"
                value={transferTime}
                onChange={(e) => setTransferTime(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-black text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 tracking-[0.2em]">สลิปโอนเงิน</label>
            <label className="flex flex-col items-center justify-center w-full h-64 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] cursor-pointer hover:bg-slate-100 hover:border-brand-primary/20 transition-all relative overflow-hidden group shadow-inner">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-brand-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p className="text-sm font-black text-slate-400">เลือกรูปภาพสลิปของคุณ</p>
                  <p className="text-[9px] text-slate-300 mt-2 font-bold uppercase tracking-widest">JPG, PNG หรือถ่ายภาพ</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <button
            onClick={submitUpload}
            className="w-full bg-brand-gradient text-white font-black py-5 rounded-[2rem] shadow-xl shadow-brand-primary/20 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg"
          >
            ยืนยันการทำรายการ
          </button>
        </div>
      </div>
    );
  }

  return <div>Error</div>;
};

export default Wallet;
