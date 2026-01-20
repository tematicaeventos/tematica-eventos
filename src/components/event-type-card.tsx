import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import type { EventTypeInfo } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EventTypeCardProps = {
  eventType: EventTypeInfo;
  className?: string;
};

export function EventTypeCard({ eventType, className }: EventTypeCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === eventType.image);

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-card border-border/60',
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="relative h-56 w-full overflow-hidden">
          {image && (
            <Image
              src={image.imageUrl}
              alt={eventType.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <div className='flex flex-col flex-1 p-6'>
        <CardContent className="flex-1 p-0">
          <CardTitle className="mb-2 text-2xl font-bold font-headline text-foreground transition-colors group-hover:text-primary">
            {eventType.title}
          </CardTitle>
          <p className="text-base text-muted-foreground line-clamp-3">
            {eventType.description}
          </p>
        </CardContent>
        <CardFooter className="p-0 pt-6">
          <Button asChild className="w-full group/button bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={`/quote/${eventType.id}`}>
              Cotizar <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
