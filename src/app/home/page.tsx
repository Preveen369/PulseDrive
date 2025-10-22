'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CameraFeed } from '@/components/home/camera-feed';
import { StressIndicator } from '@/components/home/stress-indicator';
import { StressAlert } from '@/components/home/stress-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [stressLevel, setStressLevel] = useState(25);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStressLevel((prevStress) => {
        const change = (Math.random() - 0.45) * 10;
        const newStress = Math.max(0, Math.min(100, prevStress + change));

        if (newStress > 85 && prevStress <= 85) {
          setShowAlert(true);
        }

        return newStress;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
            <StressIndicator stressLevel={stressLevel} />
          </CardContent>
        </Card>
      </div>
      <StressAlert open={showAlert} onOpenChange={setShowAlert} />
    </AppShell>
  );
}
