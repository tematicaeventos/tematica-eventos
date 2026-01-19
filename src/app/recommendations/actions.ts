'use server';

import { recommendEventsBasedOnInterest } from '@/ai/flows/recommend-events-based-on-interest';
import { events } from '@/lib/data';
import type { Event } from '@/lib/types';

export async function getRecommendations(userInterests: string): Promise<Event[]> {
  try {
    const eventsForAI = events.map(event => ({
        description: event.description,
        category: event.category,
    }));
    
    const input = {
      userInterests: userInterests,
      events: JSON.stringify(eventsForAI),
    };

    const result = await recommendEventsBasedOnInterest(input);

    if (!result || !result.recommendedEvents) {
        console.error("AI did not return recommended events.");
        return [];
    }

    // The AI returns a JSON string of descriptions.
    const recommendedDescriptions = JSON.parse(result.recommendedEvents);

    if (!Array.isArray(recommendedDescriptions)) {
        console.error("Parsed recommended events is not an array.");
        return [];
    }
    
    // Find the full event objects that match the recommended descriptions.
    const recommendedEvents = events.filter(event => 
        recommendedDescriptions.includes(event.description)
    );

    return recommendedEvents;

  } catch (error) {
    console.error('Error getting recommendations from AI:', error);
    // In case of an error, we can return an empty array or re-throw.
    // For this app, returning an empty array is a safe fallback.
    return [];
  }
}
