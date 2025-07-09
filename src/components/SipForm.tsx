import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Droplets, Leaf } from 'lucide-react';
import { SipEntry } from '@/types/sip';

interface SipFormProps {
  onSubmit: (intention: string, type: SipEntry['type']) => void;
  onCancel: () => void;
}

export const SipForm: React.FC<SipFormProps> = ({ onSubmit, onCancel }) => {
  const [intention, setIntention] = useState('');
  const [selectedType, setSelectedType] = useState<SipEntry['type']>('coffee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intention.trim()) {
      onSubmit(intention.trim(), selectedType);
    }
  };

  const sipTypes = [
    { type: 'coffee' as const, icon: Coffee, label: 'Coffee', gradient: 'gradient-coffee' },
    { type: 'tea' as const, icon: Leaf, label: 'Tea', gradient: 'gradient-tea' },
    { type: 'water' as const, icon: Droplets, label: 'Water', gradient: 'gradient-water' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">Your Mindful Moment</CardTitle>
        <CardDescription>
          Take a breath, choose your drink, and set your intention for today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drink Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Choose your sip</label>
          <div className="grid grid-cols-3 gap-2">
            {sipTypes.map(({ type, icon: Icon, label, gradient }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  selectedType === type
                    ? 'border-primary bg-primary/10 shadow-gentle'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Icon 
                  className={`w-6 h-6 mb-2 ${
                    selectedType === type ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  selectedType === type ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Intention Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="intention" className="text-sm font-medium text-foreground">
              Your intention word
            </label>
            <Input
              id="intention"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="peace, focus, gratitude..."
              className="transition-all duration-300 focus:shadow-gentle"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              A single word that captures your intention for today
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="mindful" 
              disabled={!intention.trim()}
              className="flex-1"
            >
              Record Sip
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};