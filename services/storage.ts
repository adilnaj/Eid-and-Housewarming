
import { createClient } from '@supabase/supabase-js';
import { ReservationData } from '../types';

// NOTE: To enable cloud persistence for the Admin Dashboard, 
// add SUPABASE_URL and SUPABASE_KEY to your environment variables (e.g. Vercel Project Settings)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client", e);
  }
}

export const fetchRSVPs = async (): Promise<ReservationData[]> => {
  if (!supabase) {
    console.warn("Supabase not configured. Returning local data only (Admin view will be incomplete).");
    const saved = localStorage.getItem('as_event_rsvps');
    return saved ? JSON.parse(saved) : [];
  }

  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
        console.error('Supabase fetch error:', error);
        return [];
    }
    return data as ReservationData[];
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }
};

export const saveRSVP = async (rsvp: ReservationData): Promise<void> => {
  if (!supabase) {
    console.warn("Supabase not configured. Saving locally only.");
    const saved = localStorage.getItem('as_event_rsvps');
    const current = saved ? JSON.parse(saved) : [];
    localStorage.setItem('as_event_rsvps', JSON.stringify([rsvp, ...current]));
    return;
  }

  try {
    const { error } = await supabase
      .from('rsvps')
      .insert([rsvp]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving RSVP to cloud:', error);
    // Backup save to local so user doesn't lose data, even if admin doesn't see it immediately
    const saved = localStorage.getItem('as_event_rsvps');
    const current = saved ? JSON.parse(saved) : [];
    localStorage.setItem('as_event_rsvps', JSON.stringify([rsvp, ...current]));
    alert("Connected to cloud failed, but your invitation is saved locally.");
  }
};
