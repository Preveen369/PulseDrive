import { LoginForm } from '@/components/login-form';
import { HeartPulse } from 'lucide-react';

export default function LoginPage() {
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
