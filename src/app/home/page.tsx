'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CameraFeed } from '@/components/home/camera-feed';
import { StressIndicator } from '@/components/home/stress-indicator';
import { StressAlert } from '@/components/home/stress-alert';
import { FatigueAlert } from '@/components/home/fatigue-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useDoc, useFirestore, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { getStressLevelFromImage } from '@/ai/flows/stress-level-from-image';
import { Play, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { HeartRateIndicator } from '@/components/home/heart-rate-indicator';
import { FatigueStatus } from '@/components/home/fatigue-status';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const [isMounted, setIsMounted] = useState(false);
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStressAlert, setShowStressAlert] = useState(false);
  const [showFatigueAlert, setShowFatigueAlert] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio();
  }, []);

  const userLiveStressRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/stress_data`, 'live');
  }, [firestore, user]);

  const { data: stressData } = useDoc(userLiveStressRef);
  
  const playAlertSound = async (text: string) => {
    try {
      const { audioDataUri } = await textToSpeech(text);
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Failed to play alert sound:", error);
    }
  };

  // Effect to show alerts
  useEffect(() => {
    if (!stressData) return;
    
    // Stress alert
    if (stressData.stressLevel > 85 && !showStressAlert) {
      setShowStressAlert(true);
      playAlertSound("High stress detected. Please consider taking a break.");
    }
    
    // Fatigue alert
    const fatigueStates = ['sleepy', 'fatigue', 'sleeping'];
    if (fatigueStates.includes(stressData.fatigueStatus) && !showFatigueAlert) {
        setShowFatigueAlert(true);
        playAlertSound("Drowsiness detected. Please pull over and rest now.");
    }

  }, [stressData, showStressAlert, showFatigueAlert]);

  // Effect to capture frames and analyze stress
  useEffect(() => {
    if (!isAnalysisRunning || !user || !firestore || !videoRef.current || isProcessing) {
      return;
    }

    const liveStressRef = doc(firestore, `users/${user.uid}/stress_data`, 'live');
    const stressHistoryCollectionRef = collection(firestore, `users/${user.uid}/stress_data`);

    const interval = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused && canvasRef.current && videoRef.current.readyState >= 3) {
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
            const { stressLevel, heartRate, fatigueStatus } = await getStressLevelFromImage({ frameDataUri });
            
            const newStressData = {
              stressLevel,
              heartRate,
              fatigueStatus,
              timestamp: serverTimestamp(),
              userId: user.uid,
            };

            // Update the 'live' document for real-time indicators
            setDocumentNonBlocking(liveStressRef, newStressData, { merge: true });
            
            // Add a new document to the history collection
            addDocumentNonBlocking(stressHistoryCollectionRef, newStressData);

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
  }, [isAnalysisRunning, user, firestore, isProcessing]);

  const startAnalysis = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
       toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCameraPermission(true);
      setIsAnalysisRunning(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
    }
  };

  const stopAnalysis = () => {
    setIsAnalysisRunning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  if (isUserLoading || !isMounted) {
    return <AppShell><div><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div></AppShell>;
  }
  
  if (!user) {
    // This can be a redirect or a message
    return <AppShell><div>Please log in to view this page.</div></AppShell>;
  }

  return (
    <AppShell>
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Live Analysis
        </h2>
        <div className="flex justify-end">
          {!isAnalysisRunning ? (
            <Button onClick={startAnalysis}>
              <Play className="mr-2 h-4 w-4" /> Start Analysis
            </Button>
          ) : (
            <Button onClick={stopAnalysis} variant="destructive">
              <Square className="mr-2 h-4 w-4" /> Stop Analysis
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CameraFeed 
            videoRef={videoRef} 
            isAnalysisRunning={isAnalysisRunning}
            hasCameraPermission={hasCameraPermission}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Real-time Stress Level</span>
                {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StressIndicator stressLevel={stressData?.stressLevel ?? 0} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Real-time Heart Rate</span>
                {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeartRateIndicator heartRate={stressData?.heartRate ?? 0} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Fatigue Status</span>
                {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FatigueStatus fatigueStatus={stressData?.fatigueStatus ?? 'active'} />
            </CardContent>
          </Card>
        </div>
      </div>
      <StressAlert open={showStressAlert} onOpenChange={setShowStressAlert} />
      <FatigueAlert open={showFatigueAlert} onOpenChange={setShowFatigueAlert} />
      <canvas ref={canvasRef} className="hidden"></canvas>
    </AppShell>
  );
}
