export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface JournalFormData {
  title?: string;
  content: string;
}