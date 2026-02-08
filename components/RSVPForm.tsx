
import React, { useState } from 'react';
import { ReservationData } from '../types';

interface RSVPFormProps {
  onRSVP: (data: Omit<ReservationData, 'id' | 'timestamp'>) => void;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ onRSVP }) => {
  const [formData, setFormData] = useState({
    name: '',
    guests: 1,
    guestNames: [] as string[],
    dietary: '',
    notes: '',
    confirmed: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGuestCountChange = (num: number) => {
    setFormData(prev => {
      const newGuestNames = [...prev.guestNames];
      if (num > 1) {
        // Ensure array has exactly num - 1 entries
        const targetLen = num - 1;
        while (newGuestNames.length < targetLen) newGuestNames.push('');
        if (newGuestNames.length > targetLen) newGuestNames.splice(targetLen);
      } else {
        return { ...prev, guests: num, guestNames: [] };
      }
      return { ...prev, guests: num, guestNames: newGuestNames };
    });
  };

  const handleGuestNameChange = (index: number, val: string) => {
    const nextNames = [...formData.guestNames];
    nextNames[index] = val;
    setFormData({ ...formData, guestNames: nextNames });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onRSVP(formData);
    }, 1500);
  };

  const isFormValid = formData.name.trim() !== '' && 
    (formData.guests === 1 || formData.guestNames.every(n => n.trim() !== ''));

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
      <h3 className="font-serif text-3xl mb-8 text-center italic text-[#1a1a1a]">Reserve Your Place</h3>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 block font-semibold">Your Full Name</label>
          <input 
            required
            type="text"
            className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-[#d4af37] outline-none transition-colors text-[16px] text-[#1a1a1a] rounded-none"
            placeholder="e.g. Julian Sterling"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4 block font-semibold text-center">Number of Guests</label>
          <div className="flex justify-between items-center max-w-[240px] mx-auto">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleGuestCountChange(num)}
                className={`w-12 h-12 rounded-full border transition-all duration-300 text-[16px] flex items-center justify-center tap-active
                  ${formData.guests === num ? 'border-[#d4af37] bg-[#d4af37] text-white shadow-lg' : 'border-gray-100 text-gray-400'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Guest Name Fields */}
        {formData.guests > 1 && (
          <div className="space-y-8 py-2 animate-in fade-in slide-in-from-top-4 duration-500">
            {formData.guestNames.map((gName, idx) => (
              <div key={idx} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 block font-semibold">Guest {idx + 2} Name</label>
                <input 
                  required
                  type="text"
                  className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-[#d4af37] outline-none transition-colors text-[16px] text-[#1a1a1a] rounded-none"
                  placeholder={`Name of Guest ${idx + 2}`}
                  value={gName}
                  onChange={(e) => handleGuestNameChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 block font-semibold">Dietary Notes</label>
          <input 
            type="text"
            className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-[#d4af37] outline-none transition-colors text-[16px] text-[#1a1a1a] rounded-none"
            placeholder="Allergies, Vegan, etc."
            value={formData.dietary}
            onChange={(e) => setFormData({...formData, dietary: e.target.value})}
          />
        </div>

        <div className="pt-4">
          <button 
            disabled={isSubmitting || !isFormValid}
            type="submit"
            className="w-full bg-[#1a1a1a] text-white h-[60px] text-[11px] tracking-[0.5em] uppercase hover:bg-[#333] transition-all disabled:bg-gray-100 rounded-2xl relative overflow-hidden group tap-active"
          >
            <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>Confirm Attendance</span>
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>
        
        <p className="text-[10px] text-gray-400 text-center italic opacity-70">
          Kindly respond by June 1st, 2025
        </p>
      </form>
    </div>
  );
};

export default RSVPForm;
