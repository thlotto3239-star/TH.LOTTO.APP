import React, { useEffect, useState } from 'react';
import { getLatestResults } from '../services/api';
import Loader from '../components/Loader';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchResults();
  }, [filter]);

  const fetchResults = async () => {
    setLoading(true);
    const res = await getLatestResults(filter);
    if (res.success) setResults(res.data);
    setLoading(false);
  };

  const ResultCard = ({ item }) => {
    const isGov = item.lotteryTypeId === 'TH_GOV';
    const isPending = item.prizeFirst === 'รอผล...' || !item.prizeFirst;

    return (
      <div className="animate-fade-in-up bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-7xl rotate-12 group-hover:rotate-45 transition-transform duration-700">
          <i className="fas fa-trophy"></i>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/10 blur-lg rounded-full"></div>
              <img src={item.lotteryFlag} alt="flag" className="relative w-14 h-14 rounded-full border-4 border-white shadow-md object-cover" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg tracking-tight">{item.lotteryName}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.drawDate}</p>
            </div>
          </div>
          <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm ${isPending ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            {isPending ? 'Waiting' : 'Settled'}
          </span>
        </div>

        <div className="text-center mb-10 relative">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">{isGov ? 'รางวัลที่ 1' : '3 ตัวบน'}</p>
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-brand-primary/5 blur-2xl rounded-full scale-110"></div>
            <h2 className={`relative font-black text-5xl tracking-[0.2em] ${isPending ? 'text-slate-200' : 'text-brand-primary drop-shadow-sm'}`}>
              {isGov ? (item.prize6 || 'xxxxxx') : (item.prize6 ? item.prize6.slice(-3) : 'XXX')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 text-center hover:bg-white transition-colors">
            <p className="text-xl font-black text-slate-700 tracking-wider transition-all group-hover:scale-110">{item.prizeFirst3 || 'XXX'}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{isGov ? '3 หน้า' : '3 บน'}</p>
          </div>
          <div className="bg-brand-primary p-4 rounded-2xl border border-brand-primary shadow-lg shadow-brand-primary/20 text-center hover:bg-brand-dark transition-colors">
            <p className="text-xl font-black text-white tracking-wider group-hover:scale-110 transition-all">{item.prizeLast2 || 'XX'}</p>
            <p className="text-[9px] text-white/70 font-black uppercase tracking-widest mt-1">2 ล่าง</p>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 text-center hover:bg-white transition-colors">
            <p className="text-xl font-black text-slate-700 tracking-wider transition-all group-hover:scale-110">{isGov ? (item.prizeLast3 || 'XXX') : (item.prize6 ? item.prize6.slice(-2) : 'XX')}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{isGov ? '3 ท้าย' : '2 บน'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 px-4 bg-brand-light/20 min-h-screen pt-4 space-y-8 font-prompt">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">ผลรางวัล</h1>
        <div className="h-1 w-12 bg-brand-primary rounded-full mt-1"></div>
      </div>

      <div className="animate-fade-in-up delay-100 relative">
        <i className="fas fa-filter absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/40 text-sm"></i>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl border-none bg-white shadow-lg text-sm font-black text-slate-600 outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none transition-all"
        >
          <option value="ALL">หวยทุกประเภท (แสดงทั้งหมด)</option>
          <option value="TH_GOV">สลากกินแบ่งรัฐบาล (ไทย)</option>
          <option value="LAO_DEV">สลากพัฒนา (ลาว)</option>
          <option value="HANOI">สลากฮานอย (เวียดนาม)</option>
        </select>
        <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-xs pointer-events-none"></i>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-6 animate-fade-in-up delay-200 pb-8">
          {results.length > 0 ? results.map((r, i) => <ResultCard key={i} item={r} />) : (
            <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-slate-50">
              <div className="text-slate-200 text-6xl mb-4"><i className="fas fa-search"></i></div>
              <p className="text-slate-400 font-bold tracking-wider">ไม่พบข้อมูลผลรางวัลในขณะนี้</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
