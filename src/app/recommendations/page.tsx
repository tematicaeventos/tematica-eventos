'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Event } from '@/lib/types';
import { getRecommendations } from './actions';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EventCard } from '@/components/event-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecommendationsPage() {
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!interests.trim()) {
      setError('Please enter your interests.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const result = await getRecommendations(interests);
      setRecommendations(result);
    } catch (err) {
      setError('Sorry, we couldn\'t get recommendations at this time. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Personalized Recommendations
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI find the perfect events for you.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto mb-12">
        <CardHeader>
            <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" /> Find Your Vibe</CardTitle>
            <CardDescription>
                Tell us what you&apos;re into (e.g., &quot;live jazz music, outdoor food markets, abstract art&quot;) and we&apos;ll suggest events you&apos;ll love.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., electronic music, coding workshops, street food..."
              rows={3}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto self-end">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Get Recommendations'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="fade-in">
          <h2 className="text-2xl font-bold text-center mb-8 font-headline">
            Here&apos;s what we found for you:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recommendations.map((event, index) => (
              <div
                key={event.id}
                className="fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && recommendations.length === 0 && interests && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold text-muted-foreground">
            No specific recommendations found.
          </p>
          <p className="mt-2 text-muted-foreground">Try being more specific or browse all events.</p>
        </div>
      )}
    </div>
  );
}
