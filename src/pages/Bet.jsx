import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLotteryTypes, placeBet, getUserBetHistory } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/format';

const Bet = () => {
    const location = useLocation();
    const [view, setView] = useState(location.state?.lotteryId ? 'detail' : 'list');
    const [lotteries, setLotteries] = useState([]);
    const [selectedLotto, setSelectedLotto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // Betting State
    const [tab, setTab] = useState('two'); // two, three, set
    const [betOption, setBetOption] = useState(null);
    const [number, setNumber] = useState('');
    const [slip, setSlip] = useState([]);

    useEffect(() => {
        fetchLotteries();
    }, []);

    useEffect(() => {
        if (location.state?.lotteryId && lotteries.length > 0) {
            const lotto = lotteries.find(l => l['รหัสประเภทหวย'] === location.state.lotteryId);
            if (lotto) selectLottery(lotto);
        }
    }, [location.state, lotteries]);

    const fetchLotteries = async () => {
        setLoading(true);
        const res = await getLotteryTypes();
        setLoading(false);
        if (res.success) setLotteries(res.data);
    };

    const selectLottery = (lotto) => {
        setSelectedLotto(lotto);
        setView('detail');
        setSlip([]);
        setNumber('');
        setBetOption(null);
    };

    const handleKeyPress = (key) => {
        const limit = tab === 'two' ? 2 : (tab === 'three' ? 3 : 4);
        if (key === 'del') {
            setNumber(prev => prev.slice(0, -1));
        } else if (number.length < limit) {
            const newNum = number + key;
            setNumber(newNum);
            if (newNum.length === limit) {
                setTimeout(() => addBetToSlip(newNum), 200);
            }
        }
    };

    const addBetToSlip = (num) => {
        if (!betOption) return;
        if (slip.some(s => s.number === num && s.option === betOption)) return;

        const newBet = {
            id: Date.now(),
            number: num,
            option: betOption,
            amount: tab === 'set' ? 120 : 5
        };
        setSlip([...slip, newBet]);
        setNumber('');
    };

    const updateAmount = (id, amount) => {
        setSlip(slip.map(s => s.id === id ? { ...s, amount: parseInt(amount) || 0 } : s));
    };

    const removeBet = (id) => {
        setSlip(slip.filter(s => s.id !== id));
    };

    const submitBet = async () => {
        if (slip.length === 0) return;
        setLoading(true);
        const bets = slip.map(s => ({ number: s.number, format: s.option, amount: s.amount }));
        const user = JSON.parse(localStorage.getItem('th_lotto_user'));

        const res = await placeBet(user.userId, selectedLotto['รหัสประเภทหวย'], JSON.stringify(bets));
        setLoading(false);

        if (res.success) {
            const newUser = { ...user, balance: res.data.newBalance };
            localStorage.setItem('th_lotto_user', JSON.stringify(newUser));
            setSlip([]);
            alert('ส่งโพยสำเร็จ!');
        } else {
            alert(res.error || 'ส่งโพยไม่สำเร็จ');
        }
    };

    const renderKeypad = () => {
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'OK'];
        return (
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-6">
                {keys.map((k, i) => (
                    <button
                        key={i}
                        onClick={() => k === 'OK' ? null : handleKeyPress(k)}
                        className={`h-16 rounded-2xl shadow-sm text-2xl font-black transition-all flex items-center justify-center active:scale-90 ${k === 'del' ? 'bg-red-50 text-red-500' :
                                k === 'OK' ? 'bg-brand-primary text-white shadow-brand-primary/20' :
                                    'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'
                            }`}
                    >
                        {k === 'del' ? <i className="fas fa-backspace"></i> : k}
                    </button>
                ))}
            </div>
        );
    };

    if (loading) return <Loader />;

    if (view === 'list') {
        return (
            <div className="pb-24 px-4 bg-brand-light/20 min-h-screen pt-4 space-y-8 font-prompt">
                <div className="flex justify-between items-end animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-black text-brand-dark tracking-tight">แทงหวย</h1>
                        <div className="h-1 w-12 bg-brand-primary rounded-full mt-1"></div>
                    </div>
                    <button
                        onClick={() => setShowHistory(true)}
                        className="bg-white px-5 py-2.5 rounded-full text-xs font-black text-brand-primary shadow-lg border border-slate-100 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <i className="fas fa-receipt"></i> โพยของฉัน
                    </button>
                </div>

                <div className="space-y-6 animate-fade-in-up delay-100">
                    {lotteries.map((lotto, idx) => (
                        <div
                            key={idx}
                            onClick={() => selectLottery(lotto)}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-50 cursor-pointer group hover:shadow-2xl transition-all duration-300 active:scale-95"
                        >
                            <div className="p-6 flex justify-between items-center">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-brand-primary/10 blur-xl rounded-full scale-125 group-hover:scale-150 transition-transform"></div>
                                        <img src={lotto['ลิงก์รูปภาพ']} className="relative w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover" alt="logo" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-xl tracking-tight">{lotto['ชื่อเต็ม']}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">งวดประจำวันที่ {lotto['รอบ/วันที่ออก']}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="bg-green-500 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse shadow-sm">Open</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 px-6 pb-6 mt-2">
                                <div className="bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100 text-center group-hover:bg-red-50 transition-colors">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">ปิดรับแทง</span>
                                    <span className="text-lg font-black text-red-500">{lotto['formattedClose']}</span>
                                </div>
                                <div className="bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100 text-center group-hover:bg-brand-light transition-colors">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">สามตัวบน</span>
                                    <span className="text-xl font-black text-brand-primary">฿{lotto['อัตราจ่าย_สามตัวบน']}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 bg-brand-light/20 min-h-screen font-prompt">
            <div className="bg-brand-gradient p-6 pt-12 text-white sticky top-0 z-30 shadow-2xl rounded-b-[2.5rem] flex items-center gap-4">
                <button onClick={() => setView('list')} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all active:scale-95">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div>
                    <span className="font-black text-xl tracking-tight block">{selectedLotto['ชื่อเต็ม']}</span>
                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">เลือกประเภทรางวัลและกรอกตัวเลข</span>
                </div>
            </div>

            <div className="p-4 mt-4 space-y-6">
                {/* Tabs - Premium Luxury */}
                <div className="animate-fade-in-up bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 flex gap-2">
                    {['two', 'three', 'set'].map(t => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setBetOption(null); setNumber(''); }}
                            className={`flex-1 py-3 rounded-[1.5rem] text-sm font-black tracking-widest uppercase transition-all duration-300 ${tab === t ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {t === 'two' ? '2 ตัว' : (t === 'three' ? '3 ตัว' : 'หวยชุด')}
                        </button>
                    ))}
                </div>

                {/* Options - Floating Chips */}
                <div className="animate-fade-in-up delay-100 flex flex-wrap gap-3 justify-center">
                    {(tab === 'two' ? ['สองตัวบน', 'สองตัวล่าง'] : (tab === 'three' ? ['สามตัวบน', 'สามตัวโต๊ด', 'สามตัวล่าง'] : [])).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setBetOption(opt)}
                            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${betOption === opt ? 'bg-brand-primary text-white shadow-lg scale-110' : 'bg-white text-slate-500 border border-slate-100 shadow-sm'}`}
                        >
                            {opt}
                        </button>
                    ))}
                    {tab === 'set' && <div className="bg-gold-gradient text-white px-8 py-3 rounded-full font-black text-sm shadow-xl">ชุด 4 ตัวลุ้น ฿500,000</div>}
                </div>

                {/* Display & Keypad */}
                <div className="animate-fade-in-up delay-200 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                    <div className="flex justify-center gap-3 mb-8">
                        {Array.from({ length: tab === 'two' ? 2 : (tab === 'three' ? 3 : 4) }).map((_, i) => (
                            <div key={i} className="w-14 h-18 bg-slate-50 rounded-2xl border-4 border-white shadow-inner flex items-center justify-center text-4xl font-black text-brand-dark transition-all scale-100">
                                {number[i] || ''}
                            </div>
                        ))}
                    </div>
                    {renderKeypad()}
                </div>

                {/* Slip - Glassmorphism Style */}
                {slip.length > 0 && (
                    <div className="animate-fade-in-up bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl rotate-12"><i className="fas fa-file-invoice-dollar"></i></div>
                        <h3 className="font-black text-brand-dark text-lg mb-6 flex justify-between items-center">
                            รายการแทงในตะกร้า
                            <span className="bg-slate-100 text-slate-400 text-[10px] px-3 py-1 rounded-full font-black">{slip.length} รายการ</span>
                        </h3>
                        <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                            {slip.map(s => (
                                <div key={s.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
                                    <div>
                                        <span className="text-2xl font-black text-slate-800 tracking-widest">{s.number}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">{s.option}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={s.amount}
                                                onChange={(e) => updateAmount(s.id, e.target.value)}
                                                className="w-20 bg-white border border-slate-200 rounded-xl py-2 px-3 text-center font-black text-brand-primary shadow-sm focus:ring-2 focus:ring-brand-primary/20"
                                            />
                                            <span className="absolute -top-2 -right-2 text-[8px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full font-black">BTC</span>
                                        </div>
                                        <button onClick={() => removeBet(s.id)} className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-times"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ยอดเงินรวมทั้งสิ้น</span>
                                <span className="text-2xl font-black text-brand-primary">{formatCurrency(slip.reduce((a, b) => a + b.amount, 0))}</span>
                            </div>
                            <button
                                onClick={submitBet}
                                className="w-full bg-brand-gradient text-white font-black py-5 rounded-[2rem] shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 text-lg"
                            >
                                ยืนยันและส่งโพยทันที
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bet;
