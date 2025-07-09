import { useState, useEffect } from 'react';
import { SipEntry, SipStats } from '@/types/sip';

const SIP_ENTRIES_KEY = 'siptrackr-entries';

export const useSipStorage = () => {
  const [entries, setEntries] = useState<SipEntry[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem(SIP_ENTRIES_KEY);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntries = (newEntries: SipEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(SIP_ENTRIES_KEY, JSON.stringify(newEntries));
  };

  const addSipEntry = (intention: string, type: SipEntry['type'] = 'coffee') => {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    const newEntry: SipEntry = {
      id: `sip-${Date.now()}`,
      date: today,
      timestamp,
      intention,
      type
    };

    const updatedEntries = [...entries, newEntry];
    saveEntries(updatedEntries);
    return newEntry;
  };

  const getTodaysSip = (): SipEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today) || null;
  };

  const hasSippedToday = (): boolean => {
    return getTodaysSip() !== null;
  };

  const getStats = (): SipStats => {
    const totalSips = entries.length;
    const lastSipDate = entries.length > 0 ? entries[entries.length - 1].date : null;
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let streakCount = 0;
    
    const sortedDates = [...new Set(entries.map(e => e.date))].sort();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if today has a sip
    if (sortedDates.includes(today)) {
      currentStreak = 1;
      streakCount = 1;
    }
    
    // Calculate streaks going backwards from today
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedDates[i]);
      const previousDate = new Date(sortedDates[i - 1]);
      const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streakCount++;
        if (i === sortedDates.length - 1 || (sortedDates.includes(today) && currentStreak > 0)) {
          currentStreak = streakCount;
        }
      } else {
        longestStreak = Math.max(longestStreak, streakCount);
        streakCount = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, streakCount);
    
    return {
      totalSips,
      currentStreak,
      longestStreak,
      lastSipDate
    };
  };

  return {
    entries,
    addSipEntry,
    getTodaysSip,
    hasSippedToday,
    getStats
  };
};