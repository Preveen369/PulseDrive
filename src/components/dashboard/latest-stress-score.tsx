'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LatestStressScoreCard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const liveStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: liveData, isLoading } = useDoc(liveStressRef);
  
  const stressLevel = liveData?.stressLevel;

  const getStressColor = (level: number | undefined) => {
    if (level === undefined || level === null) return 'text-muted-foreground';
    if (level > 75) return 'text-destructive';
    if (level > 40) return 'text-yellow-400';
    return 'text-green-500';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Stress Score</CardTitle>
        <CardDescription>Your most recently detected stress level.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && stressLevel === undefined ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : stressLevel !== undefined ? (
          <div className="flex items-center justify-center">
            <p className={cn('text-6xl font-bold font-headline', getStressColor(stressLevel))}>
              {stressLevel}
            </p>
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-24 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-xs text-muted-foreground">Complete an analysis session to see your score.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
