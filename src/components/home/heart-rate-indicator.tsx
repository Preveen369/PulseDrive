'use client';

import { cn } from '@/lib/utils';
import { HeartPulse } from 'lucide-react';

type HeartRateIndicatorProps = {
  heartRate: number;
};

export function HeartRateIndicator({ heartRate }: HeartRateIndicatorProps) {
  const normalizedRate = Math.max(0, Math.min(200, heartRate)); // Cap BPM for visualization

  const getHeartRateColor = (rate: number) => {
    if (rate > 100) return 'text-destructive'; // High
    if (rate < 60) return 'text-yellow-400'; // Low
    return 'text-primary'; // Normal
  };
  
  const colorClass = getHeartRateColor(normalizedRate);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-40 w-40 flex flex-col items-center justify-center">
        <HeartPulse className={cn('h-16 w-16 mb-2', colorClass)} />
        <div className="flex items-baseline">
            <span className={cn('text-5xl font-bold font-headline', colorClass)}>
                {Math.round(normalizedRate)}
            </span>
            <span className="text-lg font-medium text-muted-foreground ml-2">BPM</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Your estimated heart rate is monitored to help you stay calm and focused.
      </p>
    </div>
  );
}
