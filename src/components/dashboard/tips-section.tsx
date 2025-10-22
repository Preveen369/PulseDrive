'use client';

import { personalizedStressReductionTips } from '@/ai/flows/personalized-stress-reduction-tips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, limit, query, where } from 'firebase/firestore';

export function TipsSection() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const stressHistoryQuery = firestore && user ? query(
    collection(firestore, 'stressHistory'),
    where('userId', '==', user.uid),
    limit(7)
  ) : null;

  const { data: stressHistory, isLoading: isLoadingHistory } = useCollection(stressHistoryQuery);
  
  useEffect(() => {
    async function fetchTips() {
      if (!stressHistory || stressHistory.length === 0) {
         setTips(["Start driving to get personalized tips."]);
         setLoading(false);
         return;
      }

      try {
        setLoading(true);
        const tipsOutput = await personalizedStressReductionTips({
          weeklyStressData: JSON.stringify(stressHistory),
        });
        setTips(tipsOutput.tips);
      } catch (error) {
        console.error("Failed to fetch AI tips:", error);
        setTips(["Could not load tips at this time. Please try again later."]);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoadingHistory) {
      fetchTips();
    }
  }, [stressHistory, isLoadingHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Tips</CardTitle>
        <CardDescription>
          AI-powered suggestions to help you de-stress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
           <div className="flex items-center justify-center h-24">
             <Loader2 className="w-6 h-6 animate-spin text-primary" />
           </div>
        ) : (
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-foreground">{tip}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
