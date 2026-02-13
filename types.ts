
export interface ReservationData {
  id: string;
  name: string;
  guests: number;
  dietary: string;
  notes: string;
  confirmed: boolean;
  timestamp: number;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export enum AppState {
  ENVELOPE = 'ENVELOPE',
  LANDING = 'LANDING',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN'
}
