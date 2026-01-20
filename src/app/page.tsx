import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { eventTypes } from '@/lib/data';
import { ArrowRight, Puzzle } from 'lucide-react';
import { EventTypeCard } from '@/components/event-type-card';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-headline text-foreground">
              Nuestros Eventos
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Experiencias inolvidables para cada ocasión.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((eventType, index) => (
              <div
                key={eventType.id}
                className="fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <EventTypeCard eventType={eventType} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card border-t border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <Puzzle className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-4xl font-bold font-headline text-foreground">
            Arma tu Evento
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
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
