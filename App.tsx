
import React, { useState, useEffect } from 'react';
import { AppState, EventDetails, ReservationData } from './types';
import ModernDoors from './components/ModernDoors';
import LandingPage from './components/LandingPage';
import SuccessScreen from './components/SuccessScreen';

const MOCK_EVENT: EventDetails = {
  title: "The Solstice Gala",
  date: "Saturday, June 21st, 2025",
  time: "7:00 PM - Late",
  location: "Atherton Estate, 1200 Oak Ridge Rd",
  description: "Join us for an evening of ethereal light and high-fashion elegance to celebrate the longest day of the year.",
  dressCode: "Avant-Garde Formal"
};

const App: React.FC = () => {
  // App always initializes in ENVELOPE state (which is our ModernDoors portal)
  const [state, setState] = useState<AppState>(AppState.ENVELOPE);
  const [reservation, setReservation] = useState<ReservationData | null>(null);

  const handleOpen = () => {
    // This acts as the "redirect" to the internal website content
    setState(AppState.LANDING);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRSVP = (data: ReservationData) => {
    setReservation(data);
    setState(AppState.SUCCESS);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a]">
      {/* THE PORTAL: Only visible before the user "enters" */}
      {state === AppState.ENVELOPE && (
        <ModernDoors event={MOCK_EVENT} onOpen={handleOpen} />
      )}
      
      {/* THE WEBSITE: Revealed after the door animation */}
      {state === AppState.LANDING && (
        <LandingPage 
          event={MOCK_EVENT} 
          onRSVP={handleRSVP} 
        />
      )}

      {state === AppState.SUCCESS && reservation && (
        <SuccessScreen 
          reservation={reservation} 
          event={MOCK_EVENT} 
          onBack={() => setState(AppState.LANDING)}
        />
      )}
    </div>
  );
};

export default App;
