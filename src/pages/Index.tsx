import React, { useState } from 'react';
import { useSipStorage } from '@/hooks/useSipStorage';
import { TodaysStatus } from '@/components/TodaysStatus';
import { SipForm } from '@/components/SipForm';
import { StatsCard } from '@/components/StatsCard';
import { SipEntry } from '@/types/sip';
import sipLogo from '@/assets/siptrackr-logo.png';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const { addSipEntry, getTodaysSip, hasSippedToday, getStats } = useSipStorage();

  const handleStartSip = () => {
    setShowForm(true);
  };

  const handleSubmitSip = (intention: string, type: SipEntry['type']) => {
    addSipEntry(intention, type);
    setShowForm(false);
  };

  const handleCancelSip = () => {
    setShowForm(false);
  };

  const todaysSip = getTodaysSip();
  const hasSipped = hasSippedToday();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-morning">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={sipLogo} alt="SipTrackr" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-primary">SipTrackr</h1>
        </div>
        <p className="text-muted-foreground">Mindfulness through your first sip</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 space-y-6">
        {showForm ? (
          <SipForm onSubmit={handleSubmitSip} onCancel={handleCancelSip} />
        ) : (
          <TodaysStatus 
            hasSipped={hasSipped}
            todaysSip={todaysSip}
            onStartSip={handleStartSip}
          />
        )}

        {stats.totalSips > 0 && <StatsCard stats={stats} />}
      </main>

      {/* Footer Quote */}
      <footer className="text-center px-4 pb-8">
        <p className="text-sm text-muted-foreground italic">
          "You don't have to slow time. You just have to notice it."
        </p>
      </footer>
    </div>
  );
};

export default Index;
