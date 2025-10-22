import { personalizedStressReductionTips } from '@/ai/flows/personalized-stress-reduction-tips';
import { weeklyStressData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export async function TipsSection() {
  let tips: string[] = [];
  try {
    const tipsOutput = await personalizedStressReductionTips({
      weeklyStressData: JSON.stringify(weeklyStressData),
    });
    tips = tipsOutput.tips;
  } catch (error) {
    console.error("Failed to fetch AI tips:", error);
    tips = ["Could not load tips at this time. Please try again later."];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Tips</CardTitle>
        <CardDescription>
          AI-powered suggestions to help you de-stress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Lightbulb className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm text-foreground">{tip}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
