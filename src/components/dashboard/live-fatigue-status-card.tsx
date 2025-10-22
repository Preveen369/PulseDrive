'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Smile, Frown, Bed, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';


const statusConfig = {
  active: {
    icon: Smile,
    label: 'Active',
    color: 'text-green-500',
  },
  sleepy: {
    icon: Moon,
    label: 'Sleepy',
    color: 'text-yellow-400',
  },
  fatigue: {
    icon: Frown,
    label: 'Fatigue',
    color: 'text-orange-500',
  },
  sleeping: {
    icon: Bed,
    label: 'Sleeping',
    color: 'text-destructive',
  },
};


export function LiveFatigueStatusCard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const liveStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: liveData, isLoading } = useDoc(liveStressRef);

  const fatigueStatus = liveData?.fatigueStatus as keyof typeof statusConfig | undefined;
  const currentStatus = statusConfig[fatigueStatus || 'active'];
  const Icon = currentStatus?.icon || Smile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Fatigue Status</CardTitle>
        <CardDescription>Your most recently detected state.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && fatigueStatus === undefined ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : fatigueStatus !== undefined ? (
          <div className="flex items-center justify-center">
            <Icon className={cn('w-12 h-12 mr-4', currentStatus.color)} />
            <p className={cn('text-5xl font-bold font-headline', currentStatus.color)}>
              {currentStatus.label}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-xs text-muted-foreground">Start an analysis to see your fatigue status.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
