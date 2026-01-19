'use server';
/**
 * @fileOverview Recommends events to a user based on their interests.
 *
 * - recommendEventsBasedOnInterest - A function that recommends events based on user interests.
 * - RecommendEventsBasedOnInterestInput - The input type for the recommendEventsBasedOnInterest function.
 * - RecommendEventsBasedOnInterestOutput - The return type for the recommendEventsBasedOnInterest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendEventsBasedOnInterestInputSchema = z.object({
  userInterests: z.string().describe('A comma-separated list of the user\'s interests.'),
  events: z.string().describe('A JSON array of upcoming events. Each event should have a description and category.'),
});
export type RecommendEventsBasedOnInterestInput = z.infer<typeof RecommendEventsBasedOnInterestInputSchema>;

const RecommendEventsBasedOnInterestOutputSchema = z.object({
  recommendedEvents: z.string().describe('A JSON array of event descriptions that match the user\'s interests.'),
});
export type RecommendEventsBasedOnInterestOutput = z.infer<typeof RecommendEventsBasedOnInterestOutputSchema>;

export async function recommendEventsBasedOnInterest(input: RecommendEventsBasedOnInterestInput): Promise<RecommendEventsBasedOnInterestOutput> {
  return recommendEventsBasedOnInterestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendEventsBasedOnInterestPrompt',
  input: {schema: RecommendEventsBasedOnInterestInputSchema},
  output: {schema: RecommendEventsBasedOnInterestOutputSchema},
  prompt: `You are an event recommendation expert. Given a user's interests and a list of events, you will determine which events the user would be most interested in.

  User Interests: {{{userInterests}}}
  Events: {{{events}}}

  Recommend only the events that align with the user's interests. Return a JSON array of event descriptions for the recommended events.
  `,
});

const recommendEventsBasedOnInterestFlow = ai.defineFlow(
  {
    name: 'recommendEventsBasedOnInterestFlow',
    inputSchema: RecommendEventsBasedOnInterestInputSchema,
    outputSchema: RecommendEventsBasedOnInterestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
