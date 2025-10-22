'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
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

  const stressHistoryQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'stressHistory'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(7)
    );
  }, [firestore, user]);

  const { data: stressHistory, isLoading } = useCollection(stressHistoryQuery);
  
  const chartData = useMemo(() => {
    if (!stressHistory) return [];
    return stressHistory.map(item => ({
      day: item.timestamp ? format(item.timestamp.toDate(), 'eee') : 'N/A',
      stress: item.stressLevel,
    })).reverse();
  }, [stressHistory]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
        />
      </LineChart>
    </ChartContainer>
  );
}
