import React, { useState, useEffect } from 'react';
import { EventDetails } from '../types';

interface ModernDoorsProps {
  event: EventDetails;
  onStart?: () => void;
  onComplete: () => void;
}

const ModernDoors: React.FC<ModernDoorsProps> = ({ event, onStart, onComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  const handleStartOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    if (onStart) onStart();

    // Cinematic delay for the door swing
    setTimeout(() => setIsExiting(true), 2000);
    // Final unmount after fade
    setTimeout(() => onComplete(), 2800);
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-[#050505] overflow-hidden z-[9999] perspective-[2500px] transition-opacity duration-1000 ease-in-out
        ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Mood Lighting & Ambience */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      </div>

      {/* Door Frame Container */}
      <div className="relative w-[90vw] md:w-[440px] h-[80vh] flex flex-col items-center">
        
        {/* The Double Doors (6 Window Layout) */}
        <div className={`flex-1 w-full flex relative transition-all duration-[1600ms] ease-in-out
          ${isOpening ? 'gap-32' : 'gap-0 shadow-[0_50px_120px_rgba(0,0,0,0.95)]'}`}>
          
          {/* Left Door Leaf (3 Windows) */}
          <div 
            className={`w-1/2 h-full bg-[#0c0c0c] border-r border-white/5 relative transition-all duration-[2000ms] cubic-bezier(0.23, 1, 0.32, 1) origin-left z-20
              ${isOpening ? '[transform:rotateY(-115deg)] opacity-0' : '[transform:rotateY(0deg)]'}
              shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]`}
          >
            {/* 3 Stacked Architectural Glass Panels */}
            <div className="absolute inset-3 md:inset-5 flex flex-col gap-3 md:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 border border-white/10 rounded-[1px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.03)_100%)] bg-[length:8px_100%] backdrop-blur-[2px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10"></div>
                </div>
              ))}
            </div>

            {/* Gold Handle Left Side */}
            <div className={`absolute right-0 top-[35%] bottom-[35%] w-[2px] z-30 transition-all duration-1000 delay-300
              ${isOpening ? 'opacity-0 -translate-x-12' : 'opacity-100 -translate-x-2'} shadow-[0_0_15px_rgba(212,175,55,0.4)]`}>
              <div className="absolute inset-0 bg-gradient-to-b from-[#b8860b] via-[#d4af37] to-[#b8860b] overflow-hidden">
                <div className="absolute inset-0 w-full h-[300%] bg-gradient-to-b from-transparent via-white/50 to-transparent -translate-y-full animate-[handle-shimmer_4s_infinite_ease-in-out]"></div>
              </div>
              <div className="absolute -top-1 -left-[1px] w-1 h-1 rounded-full bg-[#d4af37] border border-black/30"></div>
              <div className="absolute -bottom-1 -left-[1px] w-1 h-1 rounded-full bg-[#d4af37] border border-black/30"></div>
            </div>
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
          </div>

          {/* Right Door Leaf (3 Windows) */}
          <div 
            className={`w-1/2 h-full bg-[#0c0c0c] border-l border-white/5 relative transition-all duration-[2000ms] cubic-bezier(0.23, 1, 0.32, 1) origin-right z-20
              ${isOpening ? '[transform:rotateY(115deg)] opacity-0' : '[transform:rotateY(0deg)]'}
              shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]`}
          >
            {/* 3 Stacked Architectural Glass Panels */}
            <div className="absolute inset-3 md:inset-5 flex flex-col gap-3 md:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 border border-white/10 rounded-[1px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.03)_100%)] bg-[length:8px_100%] backdrop-blur-[2px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10"></div>
                </div>
              ))}
            </div>

            {/* Chic Gold Accents: 2px wide, smaller height handle */}
            <div className={`absolute left-0 top-[35%] bottom-[35%] w-[2px] z-30 transition-all duration-1000 delay-300
              ${isOpening ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-2'} shadow-[0_0_15px_rgba(212,175,55,0.4)]`}>
              <div className="absolute inset-0 bg-gradient-to-b from-[#b8860b] via-[#d4af37] to-[#b8860b] overflow-hidden">
                {/* Shimmer Overlay */}
                <div className="absolute inset-0 w-full h-[300%] bg-gradient-to-b from-transparent via-white/50 to-transparent -translate-y-full animate-[handle-shimmer_4s_infinite_ease-in-out] [animation-delay:0.5s]"></div>
              </div>
              {/* Refined Cap Details */}
              <div className="absolute -top-1 -left-[1px] w-1 h-1 rounded-full bg-[#d4af37] border border-black/30"></div>
              <div className="absolute -bottom-1 -left-[1px] w-1 h-1 rounded-full bg-[#d4af37] border border-black/30"></div>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
          </div>

          {/* Golden Center Seam Light-Leak */}
          {!isOpening && (
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent blur-[1px] z-10 animate-pulse"></div>
          )}

          {/* Elegant Interaction Layer: "Enter" Inside Circle */}
          {!isOpening && (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer group"
              onClick={handleStartOpen}
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Chic Orbital Pulse Rings */}
                <div className="absolute inset-0 rounded-full border border-[#d4af37]/20 scale-100 group-hover:scale-125 transition-transform duration-[2s] ease-out"></div>
                <div className="absolute inset-4 rounded-full border border-[#d4af37]/30 group-hover:scale-90 transition-transform duration-1000"></div>
                
                {/* Center Pulse Dot */}
                <div className="absolute w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,1)] animate-gold-pulse"></div>

                {/* "Enter" Animated Text inside the circle */}
                <span className="relative z-10 text-[#d4af37] font-serif italic text-xl tracking-[0.2em] group-hover:tracking-[0.4em] transition-all duration-1000 opacity-80 group-hover:opacity-100 animate-[chic-spacing_4s_ease-in-out_infinite]">
                  Enter
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ground Reflection */}
      <div className={`absolute bottom-0 w-full h-[18vh] bg-gradient-to-t from-[#d4af37]/5 to-transparent pointer-events-none transition-opacity duration-1000 ${isOpening ? 'opacity-0' : 'opacity-100'}`}></div>
      
      <style>{`
        @keyframes chic-spacing {
          0%, 100% { letter-spacing: 0.15em; opacity: 0.7; }
          50% { letter-spacing: 0.35em; opacity: 1; }
        }
        @keyframes handle-shimmer {
          0% { transform: translateY(-100%); }
          40%, 100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default ModernDoors;