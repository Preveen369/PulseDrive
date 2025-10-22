'use client';
import { LoginForm } from '@/components/login-form';
import { useUser } from '@/firebase';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);


  if (isLoading || user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="bg-primary text-primary-foreground p-4 rounded-full">
            <HeartPulse className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-primary font-headline">
            PulseDrive
          </h1>
          <p className="text-muted-foreground text-center">
            Your AI co-pilot for safer journeys.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
