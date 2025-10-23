'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { Loader2, MapPin, LocateFixed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Location = {
  latitude: number;
  longitude: number;
};

export default function NearbySafeStopsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );
  };

  if (isUserLoading || !user) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Nearby Safe Stops</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LocateFixed /> Find Your Location
            </CardTitle>
            <CardDescription>
              Click the button below to detect your current location. This is required to find nearby safe stops.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
            <Button onClick={handleGetLocation} disabled={isLoading} size="lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2" />
              )}
              {isLoading ? 'Detecting...' : 'Detect My Location'}
            </Button>
            {location && (
              <div className="p-4 bg-secondary rounded-md text-left w-full max-w-md">
                <p className="font-semibold text-foreground">Your Location:</p>
                <p className="text-sm text-muted-foreground">
                  Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
                </p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-destructive/20 rounded-md text-destructive text-sm w-full max-w-md">
                <p>
                  <strong>Error:</strong> {error}
                </p>
                <p className="mt-1">Please ensure you have granted location permissions for this site.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
