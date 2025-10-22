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
    return query(
      collection(firestore, `users/${user.uid}/stress_data`),
      orderBy('timestamp', 'desc'),
      limit(100) // Fetch more data points for a better average
    );
  }, [firestore, user]);

  const { data: stressHistory, isLoading } = useCollection(stressHistoryQuery);

  const averageStress = useMemo(() => {
    if (!stressHistory || stressHistory.length === 0) return 0;
    const totalStress = stressHistory.reduce((acc, item) => acc + item.stressLevel, 0);
    return Math.round(totalStress / stressHistory.length);
  }, [stressHistory]);
  
  const getStressColor = (level: number) => {
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
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className={`text-6xl font-bold font-headline ${getStressColor(averageStress)}`}>
              {averageStress}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
