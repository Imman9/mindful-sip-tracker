import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SipStats } from '@/types/sip';
import { TrendingUp, Target, Trophy } from 'lucide-react';

interface StatsCardProps {
  stats: SipStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Target,
      label: 'Total Sips',
      value: stats.totalSips,
      description: 'mindful moments'
    },
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: stats.currentStreak,
      description: 'days in a row'
    },
    {
      icon: Trophy,
      label: 'Best Streak',
      value: stats.longestStreak,
      description: 'personal record'
    }
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-lg text-primary">Your Journey</CardTitle>
        <CardDescription>Tracking your mindful moments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {statItems.map(({ icon: Icon, label, value, description }) => (
            <div key={label} className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-accent/50 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-xs font-medium text-muted-foreground">{label}</div>
                <div className="text-xs text-muted-foreground/70">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};