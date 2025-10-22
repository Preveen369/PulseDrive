'use server';

/**
 * @fileOverview Provides personalized tips for new users based on their driving data and preferences.
 *
 * - getStartedTips - A function that generates personalized tips for new users.
 * - GetStartedTipsInput - The input type for the getStartedTips function.
 * - GetStartedTipsOutput - The return type for the getStartedTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetStartedTipsInputSchema = z.object({
  weeklyDrivingData: z.string().describe('A summary of the user\'s driving data from the previous week.'),
  userPreferences: z.string().describe('The user\'s preferences for the app, such as preferred alert settings and dashboard configurations.'),
});

export type GetStartedTipsInput = z.infer<typeof GetStartedTipsInputSchema>;

const GetStartedTipsOutputSchema = z.object({
  personalizedTips: z.string().describe('A list of personalized tips for the user to effectively use the app.'),
});

export type GetStartedTipsOutput = z.infer<typeof GetStartedTipsOutputSchema>;

export async function getStartedTips(input: GetStartedTipsInput): Promise<GetStartedTipsOutput> {
  return getStartedTipsFlow(input);
}

const getStartedTipsPrompt = ai.definePrompt({
  name: 'getStartedTipsPrompt',
  input: {schema: GetStartedTipsInputSchema},
  output: {schema: GetStartedTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized tips to new users of the PulseDrive app based on their driving data and preferences.

  Analyze the following driving data and user preferences to generate a list of tips that will help the user effectively use the app and improve their driving experience.

  Driving Data: {{{weeklyDrivingData}}}
  User Preferences: {{{userPreferences}}}

  Provide tips that are specific to the user's data and preferences, focusing on how they can use the app's features to reduce stress and improve safety.
`,
});

const getStartedTipsFlow = ai.defineFlow(
  {
    name: 'getStartedTipsFlow',
    inputSchema: GetStartedTipsInputSchema,
    outputSchema: GetStartedTipsOutputSchema,
  },
  async input => {
    const {output} = await getStartedTipsPrompt(input);
    return output!;
  }
);
