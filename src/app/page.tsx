import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { eventTypes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Puzzle } from 'lucide-react';
import { EventTypeCard } from '@/components/event-type-card';

export default function Home() {
  const buildEventImage = PlaceHolderImages.find(img => img.id === 'build-event-banner');

  return (
    <div className="flex flex-col">
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Button asChild size="lg" variant="outline" className="mb-8 border-primary text-primary hover:bg-primary/10">
              <Link href="/about">
                Sobre Nosotros
              </Link>
            </Button>
            <h2 className="text-4xl font-bold font-headline text-foreground">
              Nuestros Eventos
            </h2>
            <p className="mt-4 text-lg text-foreground/90 max-w-3xl mx-auto">
              Expertos en eventos y en rapidez.
              <br />
              Diseña tu evento y obtén tu cotización al instante.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((eventType, index) => (
              <div
                key={eventType.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <EventTypeCard eventType={eventType} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24 bg-black border-t border-b border-border">
         {buildEventImage && (
            <Image
                src={buildEventImage.imageUrl}
                alt={buildEventImage.description}
                fill
                className="object-cover z-0 opacity-20"
                data-ai-hint={buildEventImage.imageHint}
            />
        )}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Puzzle className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-4xl font-bold font-headline text-white">
            Arma tu Evento
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            Selecciona únicamente los servicios que necesitas y arma tu evento a tu medida. El valor se calcula automáticamente.
          </p>
          <Button asChild size="lg" className="mt-8 group bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/quotes">
              Empezar a construir <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
