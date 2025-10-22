'use client';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function AverageStressScore() {
  const { user } = useUser();
  const firestore = useFirestore();

  const stressHistoryQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Fetch recent history, not including the 'live' document
    return query(
      collection(firestore, `users/${user.uid}/stress_data`),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
  }, [firestore, user]);

  const liveStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: stressHistory, isLoading: isHistoryLoading } = useCollection(stressHistoryQuery);
  const { data: liveData, isLoading: isLiveLoading } = useDoc(liveStressRef);
  
  const historicalData = useMemo(() => stressHistory?.filter(d => d.id !== 'live'), [stressHistory]);

  const averageStress = useMemo(() => {
    const allData = [...(historicalData || [])];
    
    // Check if liveData exists and is not already in historicalData (based on timestamp)
    if (liveData && liveData.timestamp && !allData.some(d => d.timestamp?.isEqual(liveData.timestamp))) {
        allData.push(liveData);
    }
    
    if (allData.length === 0) return null;

    const totalStress = allData.reduce((acc, item) => acc + (item.stressLevel || 0), 0);
    return Math.round(totalStress / allData.length);
  }, [historicalData, liveData]);
  
  const getStressColor = (level: number | null) => {
    if (level === null) return 'text-muted-foreground';
    if (level > 75) return 'text-destructive';
    if (level > 40) return 'text-yellow-400';
    return 'text-green-500';
  };
  
  const isLoading = isHistoryLoading || isLiveLoading;

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
