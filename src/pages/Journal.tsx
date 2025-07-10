import React, { useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { JournalForm } from '@/components/JournalForm';
import { JournalEntry } from '@/components/JournalEntry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalEntry as JournalEntryType, JournalFormData } from '@/types/journal';
import { Plus, BookOpen } from 'lucide-react';
import sipLogo from '@/assets/siptrackr-logo.png';

const Journal = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryType | null>(null);
  const { entries, loading, createEntry, updateEntry, deleteEntry, getTodaysEntry } = useJournal();

  const handleSubmit = async (data: JournalFormData) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, data);
      setEditingEntry(null);
    } else {
      await createEntry(data);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: JournalEntryType) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const todaysEntry = getTodaysEntry();

  return (
    <div className="min-h-screen bg-gradient-morning">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={sipLogo} alt="SipTrackr" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-primary">Journal</h1>
        </div>
        <p className="text-muted-foreground">Reflect on your daily journey</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 space-y-6">
        {showForm ? (
          <JournalForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingEntry || undefined}
            isEditing={!!editingEntry}
          />
        ) : (
          <>
            {/* Today's Journal Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Today's Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysEntry ? (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">You've already journaled today!</p>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(todaysEntry)}
                    >
                      Edit Today's Entry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      Take a moment to reflect on your day. How are you feeling? What are you grateful for?
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Writing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Journal Entries */}
            {entries.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Journal Entries</h2>
                {entries.map((entry) => (
                  <JournalEntry
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={deleteEntry}
                  />
                ))}
              </div>
            )}

            {entries.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Start your journaling journey today
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Write Your First Entry
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Journal;