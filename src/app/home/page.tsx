'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CameraFeed } from '@/components/home/camera-feed';
import { StressIndicator } from '@/components/home/stress-indicator';
import { StressAlert } from '@/components/home/stress-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { getStressLevelFromImage } from '@/ai/flows/stress-level-from-image';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const userStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: stressData } = useDoc(userStressRef);

  const [showAlert, setShowAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Effect to show alert when stress level crosses threshold
  useEffect(() => {
    if (stressData?.stressLevel > 85 && !showAlert) {
      setShowAlert(true);
    }
  }, [stressData, showAlert]);


  // Effect to capture frames and analyze stress
  useEffect(() => {
    if (!user || !firestore || !videoRef.current || isProcessing) return;
    
    const liveStressRef = doc(firestore, `users/${user.uid}/stress_data`, 'live');

    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 3) {
        setIsProcessing(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameDataUri = canvas.toDataURL('image/jpeg');

          try {
            const { stressLevel } = await getStressLevelFromImage({ frameDataUri });
            
            await setDocumentNonBlocking(liveStressRef, {
              stressLevel,
              timestamp: serverTimestamp(),
              userId: user.uid,
            }, { merge: true });

          } catch (error) {
            console.error("Error analyzing stress from frame:", error);
          } finally {
            setIsProcessing(false);
          }
        } else {
           setIsProcessing(false);
        }
      }
    }, 4000); // Analyze every 4 seconds

    return () => clearInterval(interval);
  }, [user, firestore, isProcessing]);

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
        <CameraFeed videoRef={videoRef} />
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
      <canvas ref={canvasRef} className="hidden"></canvas>
    </AppShell>
  );
}
