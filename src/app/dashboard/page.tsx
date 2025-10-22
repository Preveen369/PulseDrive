import { AppShell } from '@/components/layout/app-shell';
import { TipsSection } from '@/components/dashboard/tips-section';
import { WeeklyTrendsChart } from '@/components/dashboard/weekly-trends-chart';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Weekly Dashboard
        </h2>

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

        <Suspense fallback={<TipsLoadingSkeleton />}>
          <TipsSection />
        </Suspense>
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
