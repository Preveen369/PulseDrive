'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function AverageStressScore() {
  const { user } = useUser();
  const firestore = useFirestore();

  const stressHistoryQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Query the main collection, excluding the 'live' document.
    return query(
      collection(firestore, `users/${user.uid}/stress_data`),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
  }, [firestore, user]);

  // We filter out the 'live' document on the client-side
  const { data: stressHistory, isLoading } = useCollection(stressHistoryQuery);
  const historicalData = useMemo(() => stressHistory?.filter(d => d.id !== 'live'), [stressHistory]);


  const averageStress = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return null;
    const totalStress = historicalData.reduce((acc, item) => acc + item.stressLevel, 0);
    return Math.round(totalStress / historicalData.length);
  }, [historicalData]);
  
  const getStressColor = (level: number | null) => {
    if (level === null) return 'text-muted-foreground';
    if (level > 75) return 'text-destructive';
    if (level > 40) return 'text-yellow-400';
    return 'text-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Stress Score</CardTitle>
        <CardDescription>Your average stress level from recent sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && averageStress === null ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : averageStress !== null ? (
          <div className="flex items-center justify-center">
            <p className={`text-6xl font-bold font-headline ${getStressColor(averageStress)}`}>
              {averageStress}
            </p>
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-24 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-xs text-muted-foreground">Complete an analysis session to see your average.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
