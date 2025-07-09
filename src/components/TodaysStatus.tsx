import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SipEntry } from '@/types/sip';
import { Coffee, Droplets, Leaf, Clock, Heart } from 'lucide-react';

interface TodaysStatusProps {
  hasSipped: boolean;
  todaysSip: SipEntry | null;
  onStartSip: () => void;
}

export const TodaysStatus: React.FC<TodaysStatusProps> = ({ 
  hasSipped, 
  todaysSip, 
  onStartSip 
}) => {
  const getSipIcon = (type: SipEntry['type']) => {
    switch (type) {
      case 'coffee': return Coffee;
      case 'tea': return Leaf;
      case 'water': return Droplets;
      default: return Coffee;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (hasSipped && todaysSip) {
    const SipIcon = getSipIcon(todaysSip.type);
    
    return (
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-morning rounded-full flex items-center justify-center mb-4">
            <SipIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl text-primary">Mindful Moment Complete</CardTitle>
          <CardDescription>You've embraced presence today</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-accent/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatTime(todaysSip.timestamp)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-lg font-medium text-primary capitalize">
                {todaysSip.intention}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            "You don't have to slow time. You just have to notice it."
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-morning rounded-full flex items-center justify-center mb-4 animate-gentle-bounce">
          <Coffee className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl text-primary">Ready for Your First Sip?</CardTitle>
        <CardDescription>
          Begin your day with intention and mindfulness
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-muted-foreground">
          Take a moment to pause, breathe, and set your intention before that first mindful sip.
        </p>
        
        <Button 
          variant="mindful" 
          size="lg" 
          onClick={onStartSip}
          className="w-full"
        >
          Start Mindful Sip
        </Button>
        
        <p className="text-xs text-muted-foreground italic">
          "The present moment is the only moment available to us, and it is the door to all moments."
        </p>
      </CardContent>
    </Card>
  );
};