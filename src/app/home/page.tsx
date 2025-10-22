'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CameraFeed } from '@/components/home/camera-feed';
import { StressIndicator } from '@/components/home/stress-indicator';
import { StressAlert } from '@/components/home/stress-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, type Firestore, collection } from 'firebase/firestore';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Note: The path is now 'users/{userId}/stress_data/{docId}'
    // For a real app, you'd likely have a specific document ID or query.
    // Here, we'll use the user's UID as the document ID for simplicity,
    // assuming one stress document per user in a 'live' collection.
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: stressData } = useDoc(userStressRef);

  const [showAlert, setShowAlert] = useState(false);

  // Effect to show alert when stress level crosses threshold
  useEffect(() => {
    if (stressData?.stressLevel > 85 && !showAlert) {
      setShowAlert(true);
    }
  }, [stressData, showAlert]);


  // Simulate real-time stress data and write to Firestore
  useEffect(() => {
    if (!user || !firestore) return;
    
    const liveStressRef = doc(firestore, `users/${user.uid}/stress_data`, 'live');
    
    const interval = setInterval(() => {
      const newStressLevel = Math.floor(Math.random() * 101);
      
      setDocumentNonBlocking(liveStressRef, {
        stressLevel: newStressLevel,
        timestamp: serverTimestamp(),
        userId: user.uid, // Denormalize for security rules
      }, { merge: true });

    }, 2000);

    return () => clearInterval(interval);
  }, [user, firestore]);

  if (isUserLoading) {
    return <AppShell><div>Loading...</div></AppShell>;
  }
  
  if (!user) {
    // This can be a redirect or a message
    return <AppShell><div>Please log in to view this page.</div></AppShell>;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Live Analysis
        </h2>
        <CameraFeed />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Real-time Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StressIndicator stressLevel={stressData?.stressLevel ?? 0} />
          </CardContent>
        </Card>
      </div>
      <StressAlert open={showAlert} onOpenChange={setShowAlert} />
    </AppShell>
  );
}
