'use server';

/**
 * @fileOverview A Genkit flow for providing personalized stress reduction tips to drivers based on their weekly stress trends.
 *
 * - personalizedStressReductionTips - A function that retrieves personalized stress reduction tips.
 * - PersonalizedStressReductionTipsInput - The input type for the personalizedStressReductionTips function.
 * - PersonalizedStressReductionTipsOutput - The return type for the personalizedStressReductionTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStressReductionTipsInputSchema = z.object({
  weeklyStressData: z
    .string()
    .describe("The driver's weekly stress data, as a stringified JSON."),
});
export type PersonalizedStressReductionTipsInput =
  z.infer<typeof PersonalizedStressReductionTipsInputSchema>;

const PersonalizedStressReductionTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('An array of personalized stress reduction tips.'),
});
export type PersonalizedStressReductionTipsOutput =
  z.infer<typeof PersonalizedStressReductionTipsOutputSchema>;

export async function personalizedStressReductionTips(
  input: PersonalizedStressReductionTipsInput
): Promise<PersonalizedStressReductionTipsOutput> {
  return personalizedStressReductionTipsFlow(input);
}

const stressReductionTipsPrompt = ai.definePrompt({
  name: 'stressReductionTipsPrompt',
  input: {schema: PersonalizedStressReductionTipsInputSchema},
  output: {schema: PersonalizedStressReductionTipsOutputSchema},
  prompt: `You are an AI assistant providing simple, actionable stress reduction tips for a driver. 
  
  Based on the following stress data, provide a few short, easy-to-understand tips.
  
  Data: {{{weeklyStressData}}}
  
  Keep the tips concise and direct. Focus on simple actions the user can take.
  Return only a JSON array of tip strings.`,
});

const personalizedStressReductionTipsFlow = ai.defineFlow(
  {
    name: 'personalizedStressReductionTipsFlow',
    inputSchema: PersonalizedStressReductionTipsInputSchema,
    outputSchema: PersonalizedStressReductionTipsOutputSchema,
  },
  async input => {
    const {output} = await stressReductionTipsPrompt(input);
    return output!;
  }
);
