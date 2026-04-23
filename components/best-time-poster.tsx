'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface BestTimeProps {
  audience?: string;
  onTimeSelected?: (time: string) => void;
}

export function BestTimeToPoster({ audience, onTimeSelected }: BestTimeProps) {
  const [bestTime, setBestTime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/best-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audience: audience || 'general' }),
      });

      if (response.ok) {
        const data = await response.json();
        setBestTime(data.time);
        onTimeSelected?.(data.time);
        toast.success('Best posting time predicted');
      } else {
        toast.error('Failed to predict best time');
      }
    } catch (error) {
      toast.error('Error predicting best time');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Best Time to Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get AI-powered recommendations for the best time to post your campaign
        </p>

        <Button onClick={handlePredict} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Analyzing...' : 'Predict Best Time'}
        </Button>

        {bestTime && (
          <div className="p-4 bg-muted rounded-md space-y-3">
            <h4 className="font-semibold">Recommended Time:</h4>
            <div className="grid grid-cols-1 gap-2">
              {bestTime.times?.map((time: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-background rounded border"
                >
                  <div>
                    <p className="font-medium">{time.day}</p>
                    <p className="text-sm text-muted-foreground">{time.timeRange}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Engagement Score</p>
                    <p className="text-lg font-bold text-primary">{time.score}%</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Based on historical data and audience behavior patterns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
