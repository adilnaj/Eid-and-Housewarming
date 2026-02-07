
import React, { useState, useEffect } from 'react';
import { EventDetails } from '../types';

interface ModernDoorsProps {
  event: EventDetails;
  onOpen: () => void;
}

const ModernDoors: React.FC<ModernDoorsProps> = ({ event, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  // Fix for mobile address bar heights
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
    setTimeout(() => {
      onOpen();
    }, 1400);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-[#080808] overflow-hidden perspective-portal z-[9999]"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-[#fdfcfb] transition-opacity duration-[1500ms] ease-out ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_80%)]"></div>
      </div>
      
      {/* Doors Container */}
      <div className={`relative w-full h-full flex transition-all duration-[1200ms] ease-in-out ${isOpening ? 'scale-150 opacity-0 blur-md' : 'scale-100'}`}>
        
        {/* Left Door */}
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full bg-[#050505] border-r border-white/5 shadow-[25px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-[1500ms] ease-in-out origin-left z-20 flex justify-end items-center pr-3
            ${isOpening ? '[transform:rotateY(-110deg)]' : '[transform:rotateY(0deg)]'}`}
        >
          <div className="absolute inset-y-0 right-12 w-[1px] bg-white/5"></div>
          <div className="relative pointer-events-none">
             <div className="w-1.5 h-64 bg-gradient-to-b from-[#e5c76b] via-[#d4af37] to-[#b58e24] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"></div>
             <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#b58e24] opacity-40"></div>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#b58e24] opacity-40"></div>
          </div>
        </div>

        {/* Right Door */}
        <div 
          className={`absolute right-0 top-0 w-1/2 h-full bg-[#050505] border-l border-white/5 shadow-[-25px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-[1500ms] ease-in-out origin-right z-20 flex justify-start items-center pl-3
            ${isOpening ? '[transform:rotateY(110deg)]' : '[transform:rotateY(0deg)]'}`}
        >
          <div className="absolute inset-y-0 left-12 w-[1px] bg-white/5"></div>
          <div className="relative pointer-events-none">
             <div className="w-1.5 h-64 bg-gradient-to-b from-[#e5c76b] via-[#d4af37] to-[#b58e24] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"></div>
             <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#b58e24] opacity-40"></div>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#b58e24] opacity-40"></div>
          </div>
        </div>

        {/* Sneak peek */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#fdfcfb] z-10">
           <span className="text-[10px] tracking-[0.6em] uppercase text-gray-400 mb-6">Welcome</span>
           <h2 className="font-serif text-5xl font-light text-[#1a1a1a] tracking-tight">{event.title}</h2>
        </div>
      </div>

      {/* Touch Interaction */}
      {!isOpening && (
        <div 
          className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer tap-active"
          onClick={handleStartOpen}
        >
           <div className="mt-[-10vh] flex flex-col items-center">
             <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent mb-16"></div>
             
             <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse"></div>
                <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
                   <span className="font-serif italic text-white/90 text-2xl tracking-wide float-animation">Enter</span>
                </div>
             </div>
           </div>

           <div className="absolute bottom-16 text-center w-full px-12">
              <p className="text-[10px] tracking-[0.8em] uppercase text-white/30 font-light mb-3 ml-[0.8em]">Invitation Only</p>
              <p className="font-serif text-white/20 italic text-sm">Tap handles to unveil</p>
           </div>
        </div>
      )}
      
      {/* Visual Frame */}
      <div className={`fixed inset-4 border border-white/5 pointer-events-none transition-opacity duration-1000 ${isOpening ? 'opacity-0' : 'opacity-100'}`}></div>
    </div>
  );
};

export default ModernDoors;
