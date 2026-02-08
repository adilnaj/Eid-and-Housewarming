
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
    
    // Notify parent to mount the LandingPage behind us
    if (onStart) onStart();

    // Sequence the transition
    // 1. Doors swing open (1600ms duration in CSS)
    // 2. Start fading out the entire overlay
    setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // 3. Finally unmount after fade out is done
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-black overflow-hidden z-[9999] perspective-[2500px] transition-opacity duration-1000 ease-in-out
        ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Cinematic Dark Background */}
      <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center">
        {/* Subtle radial glow to make the doors pop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
        
        {/* Architectural Texture */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        
        {/* Subtle Floor Reflection */}
        <div className={`absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-white/5 to-transparent transition-opacity duration-1000 ${isOpening ? 'opacity-0' : 'opacity-100'}`}></div>
      </div>

      {/* Door Structure */}
      <div className="relative w-full max-w-[340px] h-[80vh] flex flex-col items-center">
        
        {/* The Double Doors Container */}
        <div className={`flex-1 w-full flex relative group border-t-[18px] border-x-[18px] transition-all duration-[1200ms] ease-in-out
          ${isOpening ? 'border-transparent shadow-none' : 'border-[#121212] shadow-[0_0_100px_rgba(0,0,0,1)]'}`}>
          
          {/* Left Door Leaf */}
          <div 
            className={`w-1/2 h-full bg-[#121212] border-r border-black relative transition-all duration-[1600ms] ease-in-out origin-left z-20
              ${isOpening ? '[transform:rotateY(-115deg)] opacity-0' : '[transform:rotateY(0deg)]'}
              shadow-[inset_-1px_0_0_rgba(255,255,255,0.08),15px_0_40px_rgba(0,0,0,0.8)]`}
          >
            <div className="absolute inset-0 p-4 grid grid-rows-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/10 backdrop-blur-[8px] border border-white/20 rounded-[1px] shadow-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Door Leaf */}
          <div 
            className={`w-1/2 h-full bg-[#121212] border-l border-black relative transition-all duration-[1600ms] ease-in-out origin-right z-20
              ${isOpening ? '[transform:rotateY(115deg)] opacity-0' : '[transform:rotateY(0deg)]'}
              shadow-[inset_1px_0_0_rgba(255,255,255,0.08),-15px_0_40px_rgba(0,0,0,0.8)]`}
          >
            <div className="absolute inset-0 p-4 grid grid-rows-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/10 backdrop-blur-[8px] border border-white/20 rounded-[1px] shadow-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                </div>
              ))}
            </div>
            
            {/* Modern Vertical Bar Handle */}
            <div className="absolute left-4 top-1/2 -translate-y-16 w-3 h-40 bg-[#0a0a0a] rounded-full shadow-[4px_0_20px_rgba(0,0,0,1)] border-l border-white/10 flex flex-col justify-between py-1">
               <div className="w-full h-1 bg-white/5"></div>
               <div className="w-full h-1 bg-white/5"></div>
            </div>
          </div>

          {/* Centered Interaction Trigger */}
          {!isOpening && (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer group/tap"
              onClick={handleStartOpen}
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[#d4af37]/30 animate-ping opacity-40"></div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 scale-90 group-hover/tap:scale-100 transition-transform duration-500"></div>
                <div className="relative z-10 flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse"></div>
                  <div className="space-y-0.5 text-center">
                    <p className="font-serif italic text-white font-medium text-[13px] tracking-wide whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      Tap to Reveal
                    </p>
                    <div className="w-4 h-[1px] bg-[#d4af37]/60 mx-auto transition-all duration-700 group-hover/tap:w-8 group-hover/tap:bg-[#d4af37]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 
            Transparent Interior: 
            This allows the actual LandingPage (rendered in App.tsx) 
            to be visible as soon as the doors start swinging.
          */}
          <div className="absolute inset-0 bg-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      {/* Threshold Detailing */}
      <div className={`absolute bottom-0 left-0 right-0 h-2 bg-[#1a1a1a] z-[25] shadow-[inset_0_1px_5px_rgba(255,255,255,0.1)] transition-opacity duration-1000 ${isOpening ? 'opacity-0' : 'opacity-100'}`}></div>
    </div>
  );
};

export default ModernDoors;
