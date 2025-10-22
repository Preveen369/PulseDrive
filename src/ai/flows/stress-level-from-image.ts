'use server';

/**
 * @fileOverview A Genkit flow for analyzing an image of a person to determine their stress level, heart rate, and fatigue status.
 *
 * - getStressLevelFromImage - A function that analyzes an image and returns stress level, heart rate, and fatigue status.
 * - StressLevelFromImageInput - The input type for the getStressLevelFromImage function.
 * - StressLevelFromImageOutput - The return type for the getStressLevelFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StressLevelFromImageInputSchema = z.object({
  frameDataUri: z
    .string()
    .describe(
      "An image frame from a video feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type StressLevelFromImageInput = z.infer<typeof StressLevelFromImageInputSchema>;

const StressLevelFromImageOutputSchema = z.object({
  stressLevel: z.number().describe('A numerical value from 0 to 100 representing the estimated stress level.'),
  heartRate: z.number().describe('An integer value representing the estimated heart rate in beats per minute (BPM).'),
  fatigueStatus: z.enum(['active', 'sleepy', 'fatigue', 'sleeping']).describe('The estimated fatigue status of the user.'),
});
export type StressLevelFromImageOutput = z.infer<typeof StressLevelFromImageOutputSchema>;

export async function getStressLevelFromImage(
  input: StressLevelFromImageInput
): Promise<StressLevelFromImageOutput> {
  return stressLevelFromImageFlow(input);
}

const stressLevelPrompt = ai.definePrompt({
  name: 'stressLevelPrompt',
  input: {schema: StressLevelFromImageInputSchema},
  output: {schema: StressLevelFromImageOutputSchema},
  prompt: `You are an expert in psychophysiology and use photoplethysmography (PPG) to remotely estimate a person's stress level, heart rate and fatigue from facial video frames.

  Analyze the provided image frame of a person's face to estimate their current state. Your analysis should consider subtle physiological cues visible in the image, such as:
  - Heart Rate Variability (HRV) patterns inferred from micro-blushing and skin tone variations to determine stress.
  - Heart rate estimated from the frequency of the PPG signal.
  - Facial micro-expressions (e.g., furrowed brow, tightened jaw).
  - Eye metrics (e.g., pupil dilation, blink rate, eye closure duration for sleepiness/fatigue).

  Based on your analysis of the image, output a JSON object containing:
  - 'stressLevel': a numerical value from 0 (completely relaxed) to 100 (extremely stressed).
  - 'heartRate': an integer representing the estimated heart rate in beats per minute (BPM).
  - 'fatigueStatus': one of 'active', 'sleepy', 'fatigue', or 'sleeping' based on signs of drowsiness or exhaustion.

  Do not provide any conversational response or explanation. Only return the JSON object.

  Image to analyze: {{media url=frameDataUri}}
  `,
});

const stressLevelFromImageFlow = ai.defineFlow(
  {
    name: 'stressLevelFromImageFlow',
    inputSchema: StressLevelFromImageInputSchema,
    outputSchema: StressLevelFromImageOutputSchema,
  },
  async input => {
    const {output} = await stressLevelPrompt(input);
    return output!;
  }
);
