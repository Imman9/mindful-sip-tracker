export interface SipEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  timestamp: string;
  intention: string;
  type: 'coffee' | 'tea' | 'water' | 'other';
}

export interface SipStats {
  totalSips: number;
  currentStreak: number;
  longestStreak: number;
  lastSipDate: string | null;
}