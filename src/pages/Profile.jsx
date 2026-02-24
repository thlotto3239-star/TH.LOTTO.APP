import React, { useEffect, useState } from 'react';
import { getUserInfo, getUserReferralSummary, getUserWithdrawalsToday } from '../services/api';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [refSummary, setRefSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const localUser = JSON.parse(localStorage.getItem('th_lotto_user'));
            const [uRes, rRes] = await Promise.all([
                getUserInfo(localUser.userId),
                getUserReferralSummary(localUser.userId)
            ]);

            if (uRes.success) setUser({ ...localUser, ...uRes.data });
            if (rRes.success) setRefSummary(rRes.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        if (window.confirm('ต้องการออกจากระบบ?')) {
            localStorage.removeItem('th_lotto_user');
            navigate('/login');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="pb-24 space-y-8 px-4 bg-brand-light/20 min-h-screen pt-4">
            {/* Profile Header - Premium Style */}
            <div className="animate-fade-in-up bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 bg-brand-gradient rounded-full p-1 shadow-2xl mb-4 relative">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl text-brand-primary overflow-hidden">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
                    </div>
                    <h2 className="text-2xl font-black text-brand-dark tracking-tight">{user?.name}</h2>
                    <p className="text-sm text-slate-400 font-bold tracking-widest uppercase mt-1">LV.1 GOLD MEMBER</p>
                    <div className="mt-6 flex gap-3">
                        <button className="bg-brand-primary text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-95">แก้ไขโปรไฟล์</button>
                        <button className="bg-slate-100 text-slate-600 text-xs font-black px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all active:scale-95">ตั้งค่า</button>
                    </div>
                </div>
            </div>

            {/* Affiliate - Luxury Gradient with Glassmorphism */}
            <div className="animate-fade-in-up delay-100 bg-brand-gradient rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl rotate-12 group-hover:rotate-45 transition-transform duration-700">
                    <i className="fas fa-gem"></i>
                </div>
                <h3 className="font-black text-lg mb-6 flex items-center gap-3">
                    <span className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20"><i className="fas fa-users-crown"></i></span>
                    ระบบแนะนำเพื่อน
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-[1.5rem] p-4 backdrop-blur-md border border-white/10 text-center">
                        <p className="text-xl font-black mb-1">{formatCurrency(refSummary?.totalCommission || 0)}</p>
                        <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">คอมมิชชั่น</p>
                    </div>
                    <div className="bg-white/10 rounded-[1.5rem] p-4 backdrop-blur-md border border-white/10 text-center">
                        <p className="text-xl font-black mb-1">{refSummary?.totalMembers || 0}</p>
                        <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">สมาชิก</p>
                    </div>
                    <div
                        onClick={() => { navigator.clipboard.writeText(window.location.origin + '/register?ref=' + user?.userId); alert('คัดลอกลิงก์แล้ว'); }}
                        className="bg-white/20 rounded-[1.5rem] p-4 backdrop-blur-md border border-white/30 text-center cursor-pointer hover:bg-white/30 active:scale-95 transition-all"
                    >
                        <p className="text-xl font-black mb-1"><i className="fas fa-link"></i></p>
                        <p className="text-[10px] text-white/80 font-black uppercase tracking-widest">คัดลอก</p>
                    </div>
                </div>
            </div>

            {/* Bank Info - Clean Luxury */}
            <div className="animate-fade-in-up delay-200 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <h3 className="font-black text-brand-dark mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
                    บัญชีธนาคารของคุณ
                </h3>
                <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-primary text-3xl">
                        <i className="fas fa-university"></i>
                    </div>
                    <div>
                        <p className="text-lg font-black text-brand-dark">{user?.bankName}</p>
                        <p className="text-sm font-bold text-slate-500 tracking-wider mb-1">{user?.accountNumber}</p>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full inline-block uppercase">Verified</div>
                    </div>
                </div>
            </div>

            {/* Menu - Elevated List */}
            <div className="animate-fade-in-up delay-300 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mb-8">
                <div className="divide-y divide-slate-50">
                    {[
                        { icon: 'fa-history', label: 'ประวัติการเล่น', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: 'fa-shield-alt', label: 'ความปลอดภัย', color: 'text-brand-primary', bg: 'bg-brand-light' },
                        { icon: 'fa-question-circle', label: 'ศูนย์ช่วยเหลือ', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { icon: 'fa-file-alt', label: 'ข้อตกลงและเงื่อนไข', color: 'text-slate-400', bg: 'bg-slate-50' }
                    ].map((item, idx) => (
                        <button key={idx} className="w-full text-left p-6 hover:bg-slate-50 flex justify-between items-center transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                    <i className={`fas ${item.icon}`}></i>
                                </div>
                                <span className="font-black text-slate-700">{item.label}</span>
                            </div>
                            <i className="fas fa-chevron-right text-slate-300 text-sm group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    ))}
                    <button onClick={handleLogout} className="w-full text-left p-6 hover:bg-red-50 flex justify-between items-center transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-50 text-red-500 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            <span className="font-black text-red-500">ออกจากระบบ</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
