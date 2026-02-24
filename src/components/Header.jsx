import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeadset, FaTimes, FaRobot, FaPaperPlane, FaCommentDots } from 'react-icons/fa';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([{ type: 'bot', text: 'สวัสดีครับ ยินดีต้อนรับสู่ TH-LOTTO หากมีข้อสงสัยสอบถามได้เลยครับ' }]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { type: 'user', text: inputText }]);
    setInputText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: 'ขณะนี้แอดมินให้บริการลูกค้าจำนวนมาก กรุณาติดต่อทาง Line เพื่อความรวดเร็วครับ' }]);
    }, 1000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-md mx-auto bg-brand-gradient text-white p-4 flex justify-between items-center shadow-xl font-prompt rounded-b-[2rem]">
        <div onClick={() => navigate('/home')} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-110"></div>
            <img src="https://img2.pic.in.th/pic/TH-LOTTO.md.png" alt="Logo" className="relative w-11 h-11 rounded-full border-2 border-white/50 shadow-lg group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-black text-2xl tracking-tighter drop-shadow-md">TH-LOTTO</span>
        </div>

        {user ? (
          <div onClick={() => navigate('/profile')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 pr-4 cursor-pointer hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-inner">
              <FaUser className="text-sm" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black text-white/70 uppercase tracking-widest leading-none mb-0.5">{user.name || user.username}</span>
              <span className="block text-sm font-black text-white leading-none">฿{user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="bg-white text-brand-primary font-black text-xs px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">เข้าสู่ระบบ</button>
        )}
      </header>

      {/* Chat Widget - Luxury Style */}
      <div className="fixed bottom-[100px] right-4 z-50 flex flex-col items-end font-prompt">
        {showChat && (
          <div className="animate-fade-in-up bg-white w-80 h-[450px] rounded-[2.5rem] shadow-2xl mb-4 flex flex-col overflow-hidden border border-slate-100">
            <div className="bg-brand-gradient p-6 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <FaHeadset className="text-lg" />
                </div>
                <div>
                  <span className="block text-sm font-black tracking-tight">ศูนย์ช่วยเหลือออนไลน์</span>
                  <span className="block text-[10px] font-bold text-white/70 uppercase tracking-widest">แอดมินพร้อมให้บริการ</span>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"><FaTimes /></button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4 text-sm scrollbar-hide">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 items-start ${msg.type === 'user' ? 'justify-end' : ''}`}>
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm border border-slate-100 flex-shrink-0 flex items-center justify-center text-xs text-brand-primary">
                      <FaRobot />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] font-medium leading-relaxed ${msg.type === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-slate-700"
                  placeholder="พิมพ์ข้อความที่นี่..."
                />
              </div>
              <button onClick={handleSend} className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center hover:bg-brand-dark shadow-lg shadow-brand-primary/20 transition transform active:scale-90">
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-16 h-16 bg-brand-gradient text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 relative group active:scale-95"
        >
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white shadow-md group-hover:animate-bounce">1</div>
          <FaCommentDots className="text-3xl" />
        </button>
      </div>
    </>
  );
};

export default Header;
