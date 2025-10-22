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
  prompt: `You are an AI assistant designed to provide personalized stress reduction tips to drivers based on their weekly stress trends.

  Analyze the following weekly stress data and provide a list of actionable tips to help the driver reduce stress and improve their driving experience. Make sure the tips are different, and not redundant.

  Weekly Stress Data: {{{weeklyStressData}}}

  Consider factors such as driving duration, stress levels during different times of the week, and any patterns in the data.
  The tips should be concise and easy to understand. Do not give any conversational replies, only return the JSON array of tips.
  Format the output as a JSON array of strings.`,
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
