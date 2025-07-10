import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry, JournalFormData } from '@/types/journal';
import { useToast } from '@/hooks/use-toast';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch journal entries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (formData: JournalFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
        })
        .select()
        .single();

      if (error) throw error;

      setEntries([data, ...entries]);
      toast({
        title: 'Success',
        description: 'Journal entry created',
      });
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create journal entry',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateEntry = async (id: string, formData: JournalFormData) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          title: formData.title,
          content: formData.content,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(entries.map(entry => entry.id === id ? data : entry));
      toast({
        title: 'Success',
        description: 'Journal entry updated',
      });
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update journal entry',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== id));
      toast({
        title: 'Success',
        description: 'Journal entry deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete journal entry',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getTodaysEntry = () => {
    const today = new Date().toDateString();
    return entries.find(entry => 
      new Date(entry.created_at).toDateString() === today
    );
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    getTodaysEntry,
    refetch: fetchEntries,
  };
};