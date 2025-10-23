'use client';
import { AppShell } from '@/components/layout/app-shell';
import { TipsSection } from '@/components/dashboard/tips-section';
import { WeeklyTrendsChart } from '@/components/dashboard/weekly-trends-chart';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveHeartRateCard } from '@/components/dashboard/live-heart-rate-card';
import { LiveFatigueStatusCard } from '@/components/dashboard/live-fatigue-status-card';
import { LatestStressScoreCard } from '@/components/dashboard/latest-stress-score';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <AppShell><div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Weekly Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Suspense fallback={<MetricCardSkeleton />}>
                <LatestStressScoreCard />
            </Suspense>
            <Suspense fallback={<MetricCardSkeleton />}>
                <LiveHeartRateCard />
            </Suspense>
            <Suspense fallback={<MetricCardSkeleton />}>
                <LiveFatigueStatusCard />
            </Suspense>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Stress Trends</CardTitle>
                        <CardDescription>
                        Your stress levels over the past week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<ChartSkeleton />}>
                            <WeeklyTrendsChart />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
            <div className='lg:col-span-1'>
                <Suspense fallback={<TipsLoadingSkeleton />}>
                <TipsSection />
                </Suspense>
            </div>
        </div>
      </div>
    </AppShell>
  );
}

function MetricCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
    )
}

function ChartSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[200px] w-full">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )
}

function TipsLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Tips</CardTitle>
        <CardDescription>
          AI-powered suggestions to help you de-stress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-5/6" />
      </CardContent>
    </Card>
  );
}
