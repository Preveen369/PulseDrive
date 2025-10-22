'use client';
import { useState, useEffect, type RefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, VideoOff, PauseCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type CameraFeedProps = {
  videoRef: RefObject<HTMLVideoElement>;
  isAnalysisRunning: boolean;
  hasCameraPermission: boolean | null;
};

export function CameraFeed({ videoRef, isAnalysisRunning, hasCameraPermission }: CameraFeedProps) {
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef]);

  useEffect(() => {
    if (hasCameraPermission === false) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this app.',
      });
    }
  }, [hasCameraPermission, toast]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const renderOverlay = () => {
    if (!isMounted) return null;
    if (!isAnalysisRunning) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
          <Camera className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">Ready to start</p>
          <p className="text-sm text-muted-foreground">Click "Start Analysis" to begin.</p>
        </div>
      );
    }

    if (hasCameraPermission === false) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
          <VideoOff className="w-16 h-16 text-destructive mb-4" />
          <Alert variant="destructive" className="bg-destructive/20 border-destructive">
            <AlertTitle className="font-bold">Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access in your browser settings. You may need to refresh.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    if (isPaused) {
       return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4" onClick={togglePlayPause}>
          <PauseCircle className="w-16 h-16 text-white mb-4" />
          <p className="text-lg font-semibold">Video streaming is paused</p>
        </div>
      );
    }
    
    return null;
  };


  return (
    <Card className="h-full">
      <CardContent className="relative aspect-[4/3] p-0 overflow-hidden bg-secondary">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          playsInline 
          onClick={togglePlayPause}
        />
        
        {renderOverlay()}
        
        {isAnalysisRunning && hasCameraPermission && !isPaused && (
          <div className="absolute top-2 left-2 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>REC</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
