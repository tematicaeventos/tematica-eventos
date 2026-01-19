import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/event-card';
import { events } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const featuredEvents = events.slice(0, 3);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] text-center bg-primary/20 flex flex-col justify-center items-center px-4">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover z-0 opacity-20"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground font-headline">
            Vibrant Events
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80">
            Discover, attend, and create unforgettable moments. Your next great
            experience is just a click away.
          </p>
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/events">
              Explore Events <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className="fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
