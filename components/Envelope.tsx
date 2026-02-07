
import React, { useState } from 'react';
import { EventDetails } from '../types';

interface EnvelopeProps {
  event: EventDetails;
  onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ event, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleStartOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f5f2ee] p-4 overflow-hidden">
      <div 
        className={`relative transition-all duration-1000 ease-in-out cursor-pointer group 
          ${isOpening ? 'scale-150 opacity-0 translate-y-[-100px]' : 'scale-100'}`}
        onClick={handleStartOpen}
      >
        {/* Envelope Body */}
        <div className="w-80 h-56 bg-white shadow-2xl relative border border-gray-100 rounded-sm">
          {/* Top Flap */}
          <div className={`absolute top-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[100px] border-t-gray-50 transition-transform duration-700 origin-top z-20 
            ${isOpening ? 'rotate-x-180' : ''}`}>
          </div>
          
          {/* Seal */}
          {!isOpening && (
            <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 z-30 float-animation">
              <div className="w-12 h-12 bg-[#d4af37] rounded-full shadow-lg border-4 border-[#c5a028] flex items-center justify-center text-white font-serif italic text-lg select-none">
                L
              </div>
            </div>
          )}

          {/* Card Peek */}
          <div className="absolute inset-2 bg-gray-50 flex flex-col items-center justify-center p-4 text-center border border-gray-200">
             <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">Invitation</span>
             <h2 className="font-serif text-xl font-medium tracking-tight mb-1">{event.title}</h2>
             <p className="text-[9px] text-gray-500">{event.date}</p>
          </div>
        </div>

        {/* Shadow */}
        <div className="w-80 h-4 bg-black/5 blur-xl mt-8 mx-auto rounded-full"></div>

        <div className={`mt-12 text-center transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Private Invitation</p>
          <p className="font-serif italic text-gray-500">Tap to Reveal</p>
        </div>
      </div>
    </div>
  );
};

export default Envelope;
