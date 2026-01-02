
export type CrashCategory = 
  | 'Academics' 
  | 'Love Life' 
  | 'Annoying People' 
  | 'Family' 
  | 'Stress / Overthinking' 
  | 'Silly / Random' 
  | 'Other';

export interface User {
  name: string;
  username: string;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  status: string;
  lastMessageReceived?: string;
}

export interface Crashout {
  id: string;
  timestamp: number;
  description: string;
  category: CrashCategory;
  dramaLevel: number; // 1-10
  funnyQuote: string; // AI generated feedback
  userCaption: string; // User written caption
}

export interface WrappedStats {
  totalCrashouts: number;
  topCategory: CrashCategory;
  secondTopCategory: CrashCategory;
  mostActiveDay: string;
  chaosScore: number;
  headline: string;
  statLines: string[];
  closingLine: string;
}
