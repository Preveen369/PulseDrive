'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CameraFeed } from '@/components/home/camera-feed';
import { StressIndicator } from '@/components/home/stress-indicator';
import { StressAlert } from '@/components/home/stress-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Helper function for setting stress data to avoid awaiting and catch errors
function setStressData(firestore: Firestore, uid: string, data: any) {
  const stressRef = doc(firestore, 'userStress', uid);
  setDoc(stressRef, data, { merge: true })
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: stressRef.path,
        operation: 'write',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
}


export default function HomePage() {
  const { user, isLoading } = useUser();
  const firestore = useFirestore();

  const userStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userStress', user.uid);
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

    const interval = setInterval(() => {
      setStressData(firestore, user.uid, {
        stressLevel: Math.floor(Math.random() * 101),
        lastUpdated: serverTimestamp()
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [user, firestore]);

  if (isLoading) {
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
