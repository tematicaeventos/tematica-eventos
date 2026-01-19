import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, MapPin, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

import { events } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { RsvpButton } from '@/components/rsvp-button';
import { Card, CardContent } from '@/components/ui/card';

type EventPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return events.map((event) => ({
    id: event.id,
  }));
}

export default function EventPage({ params }: EventPageProps) {
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === event.image);

  const eventDetails = [
    { icon: CalendarDays, label: 'Date', value: format(new Date(event.date), 'EEEE, MMMM d, yyyy') },
    { icon: Clock, label: 'Time', value: format(new Date(`1970-01-01T${event.time}`), 'p') },
    { icon: MapPin, label: 'Location', value: event.location },
    { icon: User, label: 'Organizer', value: event.organizer },
    { icon: Tag, label: 'Category', value: <Badge variant="secondary">{event.category}</Badge> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 fade-in">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
            {image && (
              <Image
                src={image.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <div className="fade-in" style={{ animationDelay: '200ms' }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-headline">{event.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {event.description}
            </p>

            <Card className="mb-6 bg-secondary/30">
              <CardContent className="p-4 space-y-3">
                {eventDetails.map((detail) => (
                  <div key={detail.label} className="flex items-center text-sm">
                    <detail.icon className="mr-3 h-5 w-5 text-primary" />
                    <span className="font-semibold w-20">{detail.label}:</span>
                    <span className="text-muted-foreground">{detail.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <RsvpButton />
          </div>
        </div>
      </div>
    </div>
  );
}
