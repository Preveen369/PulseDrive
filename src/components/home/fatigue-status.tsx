'use client';

import { cn } from '@/lib/utils';
import { Smile, Frown, Bed, Moon } from 'lucide-react';

type FatigueStatusProps = {
  fatigueStatus: 'active' | 'sleepy' | 'fatigue' | 'sleeping';
};

const statusConfig = {
  active: {
    icon: Smile,
    label: 'Active',
    color: 'text-green-500',
    description: 'You seem alert and focused. Great job!',
  },
  sleepy: {
    icon: Moon,
    label: 'Sleepy',
    color: 'text-yellow-400',
    description: 'You seem a bit drowsy. Consider taking a short break.',
  },
  fatigue: {
    icon: Frown,
    label: 'Fatigue',
    color: 'text-orange-500',
    description: 'Signs of fatigue detected. A break is highly recommended.',
  },
  sleeping: {
    icon: Bed,
    label: 'Sleeping',
    color: 'text-destructive',
    description: 'You appear to be sleeping. Please pull over immediately.',
  },
};

export function FatigueStatus({ fatigueStatus }: FatigueStatusProps) {
  const { icon: Icon, label, color, description } = statusConfig[fatigueStatus] || statusConfig.active;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-40 w-40 flex flex-col items-center justify-center">
        <Icon className={cn('h-20 w-20', color)} />
        <span className={cn('text-2xl font-bold font-headline mt-2', color)}>
          {label}
        </span>
      </div>
       <p className="text-sm text-muted-foreground text-center max-w-xs">
        {description}
      </p>
    </div>
  );
}
