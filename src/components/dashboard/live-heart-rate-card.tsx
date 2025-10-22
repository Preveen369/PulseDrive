'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { HeartPulse, Loader2 } from 'lucide-react';

export function LiveHeartRateCard() {
  const { user } = useUser();
  const firestore = useFirestore();

  // This ref points to the 'live' document, which is updated by the home page analysis.
  const liveStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: liveData, isLoading } = useDoc(liveStressRef);
  
  // Use the heart rate from the live document, or show '--' if not available.
  const heartRate = liveData?.heartRate;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Heart Rate</CardTitle>
        <CardDescription>Your most recently recorded beats per minute.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && heartRate === undefined ? (
           <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : heartRate !== undefined ? (
          <div className="flex items-center justify-center">
              <HeartPulse className="w-12 h-12 text-primary mr-4" />
            <p className="text-6xl font-bold font-headline text-primary">
              {heartRate}
            </p>
            <span className="text-xl font-medium text-muted-foreground self-end ml-2">BPM</span>
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-24 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-xs text-muted-foreground">Start an analysis to see your heart rate.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
