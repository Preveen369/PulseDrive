'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { HeartPulse, Loader2 } from 'lucide-react';

export function HeartRateCard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const liveStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: liveData, isLoading } = useDoc(liveStressRef);
  
  const heartRate = liveData?.heartRate ?? '--';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart Rate</CardTitle>
        <CardDescription>Your estimated real-time beats per minute.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && heartRate === '--' ? (
           <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex items-center justify-center">
              <HeartPulse className="w-12 h-12 text-primary mr-4" />
            <p className="text-6xl font-bold font-headline text-primary">
              {heartRate}
            </p>
            <span className="text-xl font-medium text-muted-foreground self-end ml-2">BPM</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
