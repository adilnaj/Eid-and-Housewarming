
import React from 'react';
import { EventDetails, ReservationData } from '../types';
import RSVPForm from './RSVPForm';

interface LandingPageProps {
  event: EventDetails;
  onRSVP: (data: Omit<ReservationData, 'id' | 'timestamp'>) => void;
  onAdminClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ event, onRSVP, onAdminClick }) => {
  return (
    <div className="max-w-md mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 flex flex-col items-center">
      <header className="text-center mb-16 w-full">
        <div className="w-12 h-[1px] bg-[#d4af37]/40 mx-auto mb-10"></div>
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-8 leading-[1.2] tracking-tight text-[#1a1a1a]">
          {event.title}
        </h1>
        <p className="font-serif italic text-gray-500 text-lg mb-12 leading-relaxed max-w-[340px] mx-auto">
          {event.description}
        </p>
        <div className="w-12 h-[1px] bg-[#d4af37]/40 mx-auto"></div>
      </header>

      <section className="w-full space-y-12 mb-20 bg-white/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-100/50">
        <div className="space-y-3">
          <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 block font-semibold">When</label>
          <div className="space-y-1">
            <p className="text-xl font-medium tracking-tight text-[#1a1a1a]">{event.date}</p>
            <p className="text-gray-500 italic font-serif text-lg">{event.time}</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 block font-semibold">Where</label>
          <div className="space-y-3">
            <p className="text-xl font-medium tracking-tight text-[#1a1a1a]">{event.location}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#d4af37] border-b border-[#d4af37]/30 hover:border-[#d4af37] transition-all inline-flex items-center gap-2 pb-1 font-medium tap-active"
            >
              Get Directions
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 block font-semibold">Attire</label>
          <div className="space-y-2">
            <p className="text-xl font-medium tracking-tight text-[#1a1a1a]">{event.dressCode}</p>
            <p className="text-sm text-gray-400 italic font-serif leading-relaxed">
              We look forward to seeing your elegant festive style.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full mb-16">
        <RSVPForm onRSVP={onRSVP} />
      </div>

      <footer className="mt-16 text-center pb-8 opacity-40">
        <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">
          Afifa & Sadeem &bull; Private Residence
          <span 
            className="cursor-default select-none ml-1 opacity-0 hover:opacity-10" 
            onClick={onAdminClick}
          >.</span>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
