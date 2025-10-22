import { cn } from '@/lib/utils';

type StressIndicatorProps = {
  stressLevel: number;
};

export function StressIndicator({ stressLevel }: StressIndicatorProps) {
  const normalizedLevel = Math.max(0, Math.min(100, stressLevel));
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const offset = circumference - (normalizedLevel / 100) * circumference;

  const getStressColor = (level: number) => {
    if (level > 75) return 'text-destructive'; // Red
    if (level > 40) return 'text-yellow-500'; // Yellow
    return 'text-accent'; // Green
  };
  
  const getStressRingColor = (level: number) => {
    if (level > 75) return 'stroke-destructive'; // Red
    if (level > 40) return 'stroke-yellow-500'; // Yellow
    return 'stroke-accent'; // Green
  }

  const getStressLabel = (level: number) => {
    if (level > 75) return 'High';
    if (level > 40) return 'Moderate';
    return 'Low';
  };

  const colorClass = getStressColor(normalizedLevel);
  const ringColorClass = getStressRingColor(normalizedLevel);
  const label = getStressLabel(normalizedLevel);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-muted"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
          />
          <circle
            className={cn('transform -rotate-90 origin-center transition-all duration-500', ringColorClass)}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-5xl font-bold font-headline', colorClass)}>
            {Math.round(normalizedLevel)}
          </span>
          <span className={cn('text-sm font-semibold', colorClass)}>
            {label}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Your stress level is continuously monitored to ensure your well-being on the road.
      </p>
    </div>
  );
}
