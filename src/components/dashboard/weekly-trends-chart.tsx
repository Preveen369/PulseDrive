'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const chartConfig = {
  stress: {
    label: 'Stress',
    color: 'hsl(var(--primary))',
  },
  heartRate: {
    label: 'Heart Rate',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function WeeklyTrendsChart() {
  const { user } = useUser();
  const firestore = useFirestore();

  const stressHistoryQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/stress_data`),
      orderBy('timestamp', 'asc'), // Order by ascending to show time progression
      limit(50) // Fetch more data for a better trend line
    );
  }, [firestore, user]);

  const { data: stressHistory, isLoading } = useCollection(stressHistoryQuery);
  const historicalData = useMemo(() => stressHistory?.filter(d => d.id !== 'live'), [stressHistory]);
  
  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    return historicalData.map(item => ({
        time: item.timestamp ? format(item.timestamp.toDate(), 'HH:mm') : 'N/A',
        stress: item.stressLevel,
        heartRate: item.heartRate,
    }));
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
          right: 20,
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis 
            yAxisId="left" 
            dataKey="stress" 
            domain={[0, 100]} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8} 
            stroke="hsl(var(--primary))"
        />
        <YAxis 
            yAxisId="right" 
            orientation="right" 
            dataKey="heartRate" 
            domain={[40, 140]} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8}
            stroke="hsl(var(--destructive))"
        />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          yAxisId="left"
          dataKey="stress"
          type="natural"
          stroke="var(--color-stress)"
          strokeWidth={3}
          dot={false}
        />
        <Line
          yAxisId="right"
          dataKey="heartRate"
          type="natural"
          stroke="var(--color-heartRate)"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
