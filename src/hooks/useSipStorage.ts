import { useState, useEffect } from 'react';
import { SipEntry, SipStats } from '@/types/sip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSipStorage = () => {
  const [entries, setEntries] = useState<SipEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('sip_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEntries: SipEntry[] = data.map(entry => ({
        id: entry.id,
        date: entry.date,
        timestamp: entry.timestamp,
        intention: entry.intention,
        type: entry.type as SipEntry['type'],
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading sip entries:', error);
      toast({
        title: "Error",
        description: "Failed to load sip entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSipEntry = async (intention: string, type: SipEntry['type'] = 'coffee'): Promise<SipEntry | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to track your sips.",
          variant: "destructive",
        });
        return null;
      }

      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        intention,
        type,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('sip_entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;

      const formattedEntry: SipEntry = {
        id: data.id,
        date: data.date,
        timestamp: data.timestamp,
        intention: data.intention,
        type: data.type as SipEntry['type'],
      };

      setEntries(prev => [formattedEntry, ...prev]);
      
      toast({
        title: "Success",
        description: "Sip entry added successfully!",
      });

      return formattedEntry;
    } catch (error) {
      console.error('Error adding sip entry:', error);
      toast({
        title: "Error",
        description: "Failed to add sip entry. Please try again.",
        variant: "destructive",
      });
      return null;
    }
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
    getStats,
    isLoading
  };
};