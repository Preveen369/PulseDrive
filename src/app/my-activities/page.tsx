'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Wind, BrainCircuit, Play, Pause, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const BreathingGuide = () => {
  const steps = [
    { duration: 4000, text: 'Breathe in...', color: 'bg-blue-500/30', textColor: 'text-blue-100' },
    { duration: 4000, text: 'Hold', color: 'bg-purple-500/30', textColor: 'text-purple-100' },
    { duration: 4000, text: 'Breathe out...', color: 'bg-green-500/30', textColor: 'text-green-100' },
    { duration: 4000, text: 'Hold', color: 'bg-purple-500/30', textColor: 'text-purple-100' },
  ];

  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, steps[currentStep].duration);

    return () => clearInterval(interval);
  }, [isActive, currentStep]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const currentStyle = steps[currentStep];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind /> Guided Breathing
        </CardTitle>
        <CardDescription>Follow the prompts to regulate your breathing and calm your mind.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <div
            className={cn(
              'absolute h-full w-full rounded-full transition-all duration-1000',
              isActive ? 'scale-100' : 'scale-50',
              isActive ? currentStyle.color : 'bg-primary/20'
            )}
            style={{ animation: isActive ? `pulse ${steps[currentStep].duration}ms infinite ease-in-out` : 'none' }}
          />
          <p className={cn(
              "z-10 text-2xl font-semibold transition-colors duration-1000",
              isActive ? currentStyle.textColor : 'text-foreground'
            )}>
            {isActive ? steps[currentStep].text : 'Ready?'}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleStartPause} size="lg">
            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={handleReset} size="lg" variant="outline">
            <RefreshCw className="mr-2" />
            Reset
          </Button>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0% { transform: scale(0.9); }
            50% { transform: scale(1); }
            100% { transform: scale(0.9); }
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

const MeditationGuide = () => {
    const originalPrompts = [
      "Find a comfortable, upright position.",
      "Close your eyes gently.",
      "Focus on your natural breath.",
      "Notice the air moving in and out.",
      "If your mind wanders, gently guide it back.",
      "Acknowledge thoughts without judgment.",
      "Feel the weight of your body.",
      "Be present in this moment.",
      "Notice sounds around you without attachment.",
      "Let go of any tension you're holding.",
      "You are calm and centered.",
      "Slowly bring your awareness back to the room.",
    ];

    const [shuffledPrompts, setShuffledPrompts] = useState(originalPrompts);
    const [isActive, setIsActive] = useState(false);
    const [promptIndex, setPromptIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/large_bell_ringing_near.ogg');
        audioRef.current.volume = 1.0;
    }, []);

    useEffect(() => {
        if (!isActive) {
            return;
        };

        if (secondsLeft === 0) {
            setIsActive(false);
            if(audioRef.current) {
                audioRef.current.play();
            }
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft(prev => prev -1);
        }, 1000);

        const promptInterval = setInterval(() => {
            setPromptIndex(prev => (prev + 1) % shuffledPrompts.length);
        }, 5000);

        return () => {
            clearInterval(timer);
            clearInterval(promptInterval);
        }

    }, [isActive, secondsLeft, shuffledPrompts.length]);
    
    const shuffleArray = (array: string[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    const handleStart = () => {
        setShuffledPrompts(shuffleArray(originalPrompts));
        setIsActive(true);
        setSecondsLeft(60);
        setPromptIndex(0);
    };

    const progress = (60 - secondsLeft) / 60;
  
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit /> One-Minute Meditation
          </CardTitle>
          <CardDescription>A short session to reset and refocus your mind.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 text-center relative h-[300px]">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background transition-transform duration-1000"
              style={{
                clipPath: `circle(${isActive ? progress * 75 : 0}% at 50% 50%)`
              }}
            />
            <div className='z-10 min-h-[100px] flex flex-col items-center justify-center gap-4'>
            {isActive ? (
                <>
                    <p className="text-xl text-foreground transition-opacity duration-1000 animate-fade-in-out" key={promptIndex}>
                        {shuffledPrompts[promptIndex]}
                    </p>
                    <p className="text-5xl font-bold text-primary">{secondsLeft}s</p>
                </>
            ) : (
                <p className="text-xl text-muted-foreground">Press start to begin your meditation.</p>
            )}
            </div>
            {!isActive && (
                <Button onClick={handleStart} size="lg" className="z-10">
                    <Play className='mr-2' /> Start Meditation
                </Button>
            )}
            <style jsx>{`
                @keyframes fade-in-out {
                    0%, 100% { opacity: 0; }
                    10%, 90% { opacity: 1; }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 5s infinite;
                }
            `}</style>
        </CardContent>
      </Card>
    );
  };

export default function MyActivitiesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          My Activities
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreathingGuide />
            <MeditationGuide />
        </div>
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'><Music /> Calming Music</CardTitle>
                <CardDescription>Listen to a curated playlist to help you relax and de-stress.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild size="lg" className='w-full md:w-auto'>
                    <Link href="https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO" target="_blank">
                        Open Spotify Playlist
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
