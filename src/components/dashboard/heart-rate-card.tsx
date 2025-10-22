'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';

export function HeartRateCard() {
  // NOTE: Heart rate data is not available yet. This is a placeholder.
  const heartRate = '--'; 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart Rate</CardTitle>
        <CardDescription>Your estimated beats per minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
            <HeartPulse className="w-12 h-12 text-primary mr-4" />
          <p className="text-6xl font-bold font-headline text-primary">
            {heartRate}
          </p>
           <span className="text-xl font-medium text-muted-foreground self-end ml-2">BPM</span>
        </div>
      </CardContent>
    </Card>
  );
}
