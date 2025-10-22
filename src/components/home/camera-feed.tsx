'use client';
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported in this browser.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  return (
    <Card>
      <CardContent className="relative aspect-[3/4] p-0 overflow-hidden bg-secondary">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
            <VideoOff className="w-16 h-16 text-destructive mb-4" />
             <Alert variant="destructive" className="bg-destructive/20 border-destructive">
                <AlertTitle className="font-bold">Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings to use this feature. You may need to refresh the page after granting permission.
                </AlertDescription>
              </Alert>
          </div>
        )}
         {hasCameraPermission === true && (
            <div className="absolute top-2 left-2 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>REC</span>
            </div>
         )}
      </CardContent>
    </Card>
  );
}
