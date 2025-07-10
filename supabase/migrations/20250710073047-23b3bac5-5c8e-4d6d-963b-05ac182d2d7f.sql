-- Create a table for sip entries
CREATE TABLE public.sip_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  intention TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coffee', 'tea', 'water', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sip_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own sip entries" 
ON public.sip_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sip entries" 
ON public.sip_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sip entries" 
ON public.sip_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sip entries" 
ON public.sip_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sip_entries_updated_at
BEFORE UPDATE ON public.sip_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_sip_entries_user_date ON public.sip_entries(user_id, date);
CREATE INDEX idx_sip_entries_user_created_at ON public.sip_entries(user_id, created_at);