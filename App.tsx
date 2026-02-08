
import React, { useState, useEffect } from 'react';
import { AppState, EventDetails, ReservationData } from './types';
import ModernDoors from './components/ModernDoors';
import LandingPage from './components/LandingPage';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';

const MOCK_EVENT: EventDetails = {
  title: "Afifa and Sadeem's Eid and Housewarming",
  date: "Saturday, June 21st, 2025",
  time: "4:00 PM - 9:00 PM",
  location: "Our New Home, 1200 Oak Ridge Rd",
  description: "Join us as we celebrate the blessings of Eid and the warmth of our new home. We look forward to sharing this joyful milestone with our friends and family.",
  dressCode: "Chic & Festive"
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.ENVELOPE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<ReservationData | null>(null);
  const [allReservations, setAllReservations] = useState<ReservationData[]>([]);

  // Check for admin URL parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setState(AppState.ADMIN);
    }

    // Load existing reservations from localStorage for the host
    const saved = localStorage.getItem('as_event_rsvps');
    if (saved) {
      try {
        setAllReservations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse RSVPs");
      }
    }
  }, []);

  const handleStartOpen = () => {
    // We stay in ENVELOPE state but flag that we are transitioning
    // to allow LandingPage to mount behind the doors.
    setIsTransitioning(true);
  };

  const handleFinishOpen = () => {
    setState(AppState.LANDING);
    setIsTransitioning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRSVP = (data: Omit<ReservationData, 'id' | 'timestamp'>) => {
    const newReservation: ReservationData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    
    const updated = [newReservation, ...allReservations];
    setAllReservations(updated);
    localStorage.setItem('as_event_rsvps', JSON.stringify(updated));
    
    setCurrentReservation(newReservation);
    setState(AppState.SUCCESS);
  };

  const goToAdmin = () => {
    setState(AppState.ADMIN);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a]">
      {/* Doors Overlay: Visible in ENVELOPE state or during transition */}
      {(state === AppState.ENVELOPE || isTransitioning) && (
        <ModernDoors 
          event={MOCK_EVENT} 
          onStart={handleStartOpen}
          onComplete={handleFinishOpen} 
        />
      )}
      
      {/* Main Content: Rendered when in LANDING state OR when transitioning to it */}
      {(state === AppState.LANDING || isTransitioning) && (
        <LandingPage 
          event={MOCK_EVENT} 
          onRSVP={handleRSVP}
          onAdminClick={goToAdmin}
        />
      )}

      {state === AppState.SUCCESS && currentReservation && (
        <SuccessScreen 
          reservation={currentReservation} 
          event={MOCK_EVENT} 
          onBack={() => setState(AppState.LANDING)}
        />
      )}

      {state === AppState.ADMIN && (
        <AdminDashboard 
          reservations={allReservations} 
          onClose={() => setState(AppState.LANDING)}
        />
      )}
    </div>
  );
};

export default App;
