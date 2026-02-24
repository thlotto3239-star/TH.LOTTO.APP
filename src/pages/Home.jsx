import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomePageData, getLatestResults } from '../services/api';
import Loader from '../components/Loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [homeData, resultData] = await Promise.all([
        getHomePageData(),
        getLatestResults('ALL')
      ]);

      if (homeData.success) setData(homeData.data);
      if (resultData.success && resultData.data.length > 0) {
        setLatestResult(resultData.data[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 pb-24 px-4 bg-brand-light/20 min-h-screen pt-4">
      {/* Sliders */}
      {data?.sliders && (
        <div className="animate-fade-in-up">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={12}
            slidesPerView={'auto'}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            {data.sliders.map((s, idx) => (
              <SwiperSlide key={idx} className="w-[92%]">
                <a href={s['ลิงก์ปลายทาง'] || '#'} className="block overflow-hidden rounded-2xl group">
                  <img src={s['ลิงก์รูปภาพ']} alt={s['หัวข้อ']} className="w-full h-auto aspect-[21/10] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Latest Result Hero - Premium Glassmorphism */}
      {latestResult && (
        <div
          onClick={() => navigate('/results')}
          className="animate-fade-in-up delay-100 bg-brand-gradient rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl rotate-12 group-hover:rotate-45 transition-transform duration-700">
            <i className="fas fa-crown"></i>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <img src={latestResult.lotteryFlag} alt="flag" className="w-5 h-5 rounded-full ring-2 ring-white/30" />
                <span className="font-bold text-xs">ประกาศผล: {latestResult.lotteryName}</span>
              </div>
              <span className="text-[10px] text-white/60 font-medium tracking-wider">{latestResult.drawDate}</span>
            </div>

            <div className="text-center py-4">
              <p className="text-[11px] text-white/70 uppercase tracking-[0.3em] font-medium mb-3">รางวัลที่ 1</p>
              <div className="flex justify-center gap-2">
                {latestResult.prizeFirst.split('').map((num, i) => (
                  <span key={i} className="inline-block w-12 h-16 bg-white rounded-xl text-brand-dark text-4xl font-black flex items-center justify-center shadow-lg transform rotate-[-2deg] first:rotate-[2deg] even:rotate-[1deg] hover:rotate-0 transition-transform">
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/10">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl py-3 border border-white/10">
                <p className="text-[10px] text-white/60 mb-1 uppercase tracking-widest font-bold">2 ตัวล่าง</p>
                <p className="text-2xl font-black">{latestResult.prizeLast2 || '-'}</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl py-3 border border-white/10">
                <p className="text-[10px] text-white/60 mb-1 uppercase tracking-widest font-bold">3 ตัวบน</p>
                <p className="text-2xl font-black">{latestResult.prize6 ? latestResult.prize6.slice(-3) : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Lotto Grid */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-end gap-3 mb-6">
          <h2 className="text-2xl font-black text-brand-dark">แทงหวย</h2>
          <div className="h-1 w-12 bg-brand-primary rounded-full mb-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {data?.popularLotto?.map((lotto, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/bet', { state: { lotteryId: lotto['รหัสประเภทหวย'] } })}
              className="group relative flex flex-col items-center bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer border border-slate-100 hover:border-brand-primary/30"
            >
              <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-md">LIVE</span>
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-500"></div>
                <img src={lotto['ลิงก์รูปภาพ']} alt={lotto['ชื่อย่อ']} className="relative h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-md group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-brand-primary/20"></span>
              </div>
              <span className="text-xs font-black text-gray-800 text-center truncate w-full mb-1">{lotto['ชื่อย่อ']}</span>
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                <i className="far fa-clock text-[8px] text-slate-400"></i>
                <span className="text-[10px] text-slate-500 font-bold">{lotto['เวลาปิดรับ']}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotions - Cards with Depth */}
      <section className="animate-fade-in-up delay-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-brand-dark">โปรโมชั่นร้อนแรง</h2>
          <button onClick={() => navigate('/wallet')} className="text-brand-primary text-xs font-black uppercase tracking-widest hover:-translate-x-1 transition-transform">ดูทั้งหมด</button>
        </div>
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          className="pb-6"
        >
          {data?.promos?.map((p, idx) => (
            <SwiperSlide key={idx} className="!w-[85%] max-w-[320px]">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-full flex flex-col group hover:shadow-2xl transition-shadow duration-300">
                <div className="relative overflow-hidden h-44">
                  <img src={p['ลิงก์รูปภาพ']} alt={p['หัวข้อโปร']} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-black text-base text-brand-dark mb-2 leading-tight">{p['หัวข้อโปร']}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 font-medium flex-1">{p['ข้อความโปร (บรรทัด1)']}</p>
                  <button onClick={() => navigate('/wallet')} className="w-full bg-brand-primary text-white text-xs py-3 rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-dark active:scale-95 transition-all">รับโปรโมชั่นทันที</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default Home;
