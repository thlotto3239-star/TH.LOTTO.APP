import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTicketAlt, FaTrophy, FaWallet, FaUser } from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = path === to;
    return (
      <Link to={to} className="flex flex-col items-center justify-center flex-1 transition-all duration-300 relative group">
        <div className={`z-10 transition-all duration-500 flex flex-col items-center ${isActive ? '-translate-y-4' : 'translate-y-0'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-brand-gradient text-white shadow-xl shadow-brand-primary/40 rotate-[10deg]' : 'text-slate-400 group-hover:text-brand-primary'}`}>
            <Icon className={`text-xl ${isActive ? 'scale-110' : ''}`} />
          </div>
          <span className={`text-[10px] mt-1.5 transition-all duration-300 tracking-tighter ${isActive ? 'font-black text-brand-dark opacity-100 scale-110' : 'font-bold text-slate-400 opacity-60'}`}>
            {label}
          </span>
        </div>
        {isActive && (
          <div className="absolute top-0 w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto h-[90px] bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] px-4 font-prompt">
      <NavItem to="/home" icon={FaHome} label="หน้าหลัก" />
      <NavItem to="/bet" icon={FaTicketAlt} label="แทงหวย" />
      <NavItem to="/results" icon={FaTrophy} label="ผลรางวัล" />
      <NavItem to="/wallet" icon={FaWallet} label="ฝาก/ถอน" />
      <NavItem to="/profile" icon={FaUser} label="โปรไฟล์" />
    </nav>
  );
};

export default Footer;
