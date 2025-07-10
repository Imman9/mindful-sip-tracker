import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { JournalFormData, JournalEntry } from '@/types/journal';
import { X, Save } from 'lucide-react';

const journalSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});

interface JournalFormProps {
  onSubmit: (data: JournalFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: JournalEntry;
  isEditing?: boolean;
}

export const JournalForm = ({ onSubmit, onCancel, initialData, isEditing = false }: JournalFormProps) => {
  const form = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  });

  const handleSubmit = async (data: JournalFormData) => {
    await onSubmit(data);
    if (!isEditing) {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Give your entry a title..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How was your day?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts, feelings, and reflections..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};