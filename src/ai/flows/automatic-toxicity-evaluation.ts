'use server';

/**
 * @fileOverview An AI agent for automatically evaluating text toxicity.
 *
 * - automaticToxicityEvaluation - A function that evaluates the toxicity of a given text.
 * - AutomaticToxicityEvaluationInput - The input type for the automaticToxicityEvaluation function.
 * - AutomaticToxicityEvaluationOutput - The return type for the automaticToxicityEvaluation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticToxicityEvaluationInputSchema = z.object({
  text: z.string().describe('The text to evaluate for toxicity.'),
});
export type AutomaticToxicityEvaluationInput = z.infer<typeof AutomaticToxicityEvaluationInputSchema>;

const AutomaticToxicityEvaluationOutputSchema = z.object({
  toxicityScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the toxicity of the text. Higher scores indicate higher toxicity.'
    ),
});
export type AutomaticToxicityEvaluationOutput = z.infer<typeof AutomaticToxicityEvaluationOutputSchema>;

export async function automaticToxicityEvaluation(
  input: AutomaticToxicityEvaluationInput
): Promise<AutomaticToxicityEvaluationOutput> {
  return automaticToxicityEvaluationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automaticToxicityEvaluationPrompt',
  input: {schema: AutomaticToxicityEvaluationInputSchema},
  output: {schema: AutomaticToxicityEvaluationOutputSchema},
  prompt: `You are an AI assistant specializing in toxicity detection.
  Your task is to evaluate the toxicity of the given text and provide a toxicity score between 0 and 1.
  A higher score indicates higher toxicity.
  Return ONLY a floating point number.

  Text: {{{text}}}
  `,
});

const automaticToxicityEvaluationFlow = ai.defineFlow(
  {
    name: 'automaticToxicityEvaluationFlow',
    inputSchema: AutomaticToxicityEvaluationInputSchema,
    outputSchema: AutomaticToxicityEvaluationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
