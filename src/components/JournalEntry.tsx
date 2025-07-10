import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JournalEntry as JournalEntryType } from '@/types/journal';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface JournalEntryProps {
  entry: JournalEntryType;
  onEdit: (entry: JournalEntryType) => void;
  onDelete: (id: string) => void;
}

export const JournalEntry = ({ entry, onEdit, onDelete }: JournalEntryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isToday = () => {
    return new Date(entry.created_at).toDateString() === new Date().toDateString();
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {entry.title && (
              <h3 className="font-semibold text-lg mb-1">{entry.title}</h3>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy')}</span>
              {isToday() && <Badge variant="secondary">Today</Badge>}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this journal entry? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(entry.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {isExpanded ? entry.content : truncateContent(entry.content)}
        </div>
        {entry.content.length > 150 && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 p-0 h-auto text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};