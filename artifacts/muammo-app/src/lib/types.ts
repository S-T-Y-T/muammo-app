declare global {
  interface Window {
    ymaps: any;
  }
}

export type Muhimlik = 'yuqori' | 'orta';

export interface Muammo {
  id: string;
  nomi: string;
  tavsif: string;
  rasm?: string | null;
  muhimlik: Muhimlik;
  narx: number;
  lat: number;
  lng: number;
  sana: string; // ISO string
}

export interface PendingCoords {
  lat: number;
  lng: number;
  muhimlik: Muhimlik;
}
