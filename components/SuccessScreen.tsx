
import React from 'react';
import { ReservationData, EventDetails } from '../types';

interface SuccessScreenProps {
  reservation: ReservationData;
  event: EventDetails;
  onBack: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ reservation, event, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 text-center bg-[#fdfcfb]">
      <div className="max-w-sm w-full space-y-12 animate-in zoom-in-95 duration-1000">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 blur-2xl rounded-full opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-white shadow-xl rounded-full flex items-center justify-center text-green-500 border border-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-4xl mb-4 italic text-[#1a1a1a]">You're Confirmed</h2>
          <div className="text-gray-500 font-serif text-xl leading-relaxed italic px-4 space-y-2">
            <p>Thank you, {reservation.name}.</p>
            <p className="text-sm opacity-80">We are excited to celebrate with you!!</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold">Party Details</span>
              <span className="font-medium text-[#1a1a1a]">{reservation.guests} {reservation.guests > 1 ? 'Total Guests' : 'Guest'}</span>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500 italic font-serif">{reservation.name}</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-50"></div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold">Event</span>
            <span className="font-medium text-right text-[#1a1a1a]">{event.title}</span>
          </div>
          <div className="w-full h-[1px] bg-gray-50"></div>
          <div className="flex justify-between items-start text-sm">
            <span className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold mt-1">Location</span>
            <span className="font-medium text-right text-xs text-[#1a1a1a] max-w-[160px] leading-relaxed">{event.location}</span>
          </div>
        </div>

        <div className="pt-8 flex flex-col gap-6">
           <button 
             className="w-full h-[60px] bg-[#1a1a1a] text-white text-[11px] tracking-[0.5em] uppercase rounded-2xl shadow-lg tap-active"
             onClick={() => window.print()}
           >
             Save Invitation
           </button>
           <button 
             className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37] font-bold tap-active"
             onClick={onBack}
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
