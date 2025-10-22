'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const chartConfig = {
  stress: {
    label: 'Stress Level',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function WeeklyTrendsChart() {
  const { user } = useUser();
  const firestore = useFirestore();

  const stressHistoryQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/stress_data`),
      orderBy('timestamp', 'desc'),
      limit(50) // Fetch more data for a better trend line
    );
  }, [firestore, user]);

  const { data: stressHistory, isLoading } = useCollection(stressHistoryQuery);
  const historicalData = useMemo(() => stressHistory?.filter(d => d.id !== 'live'), [stressHistory]);
  
  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    // Aggregate data by day, taking the average stress level for each day.
    const dailyAverages = historicalData.reduce((acc, item) => {
      if (!item.timestamp) return acc;
      const day = format(item.timestamp.toDate(), 'eee');
      if (!acc[day]) {
        acc[day] = { day, totalStress: 0, count: 0 };
      }
      acc[day].totalStress += item.stressLevel;
      acc[day].count++;
      return acc;
    }, {} as Record<string, {day: string, totalStress: number, count: number}>);

    const orderedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return orderedDays.map(day => {
       if (dailyAverages[day]) {
         return { day, stress: Math.round(dailyAverages[day].totalStress / dailyAverages[day].count) };
       }
       return { day, stress: undefined }; // Use undefined for days with no data
    });
  }, [historicalData]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full text-center">
            <p className="text-muted-foreground">No historical data to display.</p>
            <p className="text-xs text-muted-foreground">Complete a few analysis sessions to see your trends.</p>
        </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: -20,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis dataKey="stress" domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Line
          dataKey="stress"
          type="natural"
          stroke="var(--color-stress)"
          strokeWidth={3}
          dot={{
            fill: 'var(--color-stress)',
          }}
          activeDot={{
            r: 6,
          }}
          connectNulls // This will connect lines across points with no data
        />
      </LineChart>
    </ChartContainer>
  );
}
