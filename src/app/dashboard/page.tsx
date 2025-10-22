import { AppShell } from '@/components/layout/app-shell';
import { TipsSection } from '@/components/dashboard/tips-section';
import { WeeklyTrendsChart } from '@/components/dashboard/weekly-trends-chart';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AverageStressScore } from '@/components/dashboard/average-stress-score';
import { HeartRateCard } from '@/components/dashboard/heart-rate-card';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Weekly Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className='md:col-span-1 lg:col-span-2'>
              <AverageStressScore />
            </div>
             <div className='md:col-span-1 lg:col-span-2'>
              <HeartRateCard />
            </div>
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
                        <WeeklyTrendsChart />
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
