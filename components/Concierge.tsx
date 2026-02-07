
import React, { useState } from 'react';
import { EventDetails } from '../types';
import { getConciergeResponse } from '../services/geminiService';

interface ConciergeProps {
  event: EventDetails;
}

const Concierge: React.FC<ConciergeProps> = ({ event }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    const result = await getConciergeResponse(query, event);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-[#fcfaf7] border border-gray-100 p-7 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="font-serif text-2xl italic mb-1 text-[#1a1a1a]">AI Concierge</h4>
          <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold">Personalized Assistance</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 text-[#d4af37]">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
      </div>

      <form onSubmit={handleAsk} className="relative mb-6">
        <input 
          type="text"
          className="w-full bg-white border border-gray-100 px-5 py-4 text-[16px] rounded-2xl focus:ring-1 focus:ring-[#d4af37]/30 outline-none pr-14 transition-all shadow-inner text-[#1a1a1a]"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          disabled={isLoading || !query.trim()}
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#d4af37] disabled:opacity-20 tap-active"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
        </button>
      </form>

      {response && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-600 animate-in fade-in zoom-in-95 shadow-sm">
           <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold block mb-3">Response</span>
           <p className="font-serif italic text-[15px]">{response}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {['Parking', 'Attire ideas', 'Hotels'].map(tag => (
          <button 
            key={tag}
            type="button"
            onClick={() => setQuery(tag + ' help')}
            className="text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-2 rounded-full border border-gray-100 text-gray-400 bg-white hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all tap-active"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Concierge;
