import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type EventCardProps = {
  event: Event;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === event.image);

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      <Link href={`/events/${event.id}`} className="flex h-full flex-col">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            {image && (
              <Image
                src={image.imageUrl}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <Badge variant="secondary" className="mb-2">
            {event.category}
          </Badge>
          <CardTitle className="mb-2 text-lg font-bold group-hover:text-primary-foreground leading-tight">
            {event.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
