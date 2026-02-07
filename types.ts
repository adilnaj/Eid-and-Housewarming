
export interface ReservationData {
  name: string;
  guests: number;
  dietary: string;
  notes: string;
  confirmed: boolean;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  dressCode: string;
}

export enum AppState {
  ENVELOPE = 'ENVELOPE',
  LANDING = 'LANDING',
  SUCCESS = 'SUCCESS'
}
