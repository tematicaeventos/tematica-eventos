import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { eventTypes } from '@/lib/data';
import { ArrowRight, Puzzle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { EventTypeCard } from '@/components/event-type-card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] text-center bg-black flex flex-col justify-center items-center px-4">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover z-0 opacity-30"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-headline">
            Temática Eventos
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
            Tu evento soñado, a un clic de distancia.
          </p>
          <Button asChild size="lg" className="mt-8 group bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/quotes">
              Cotizar Ahora <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

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
            Temática Eventos te ofrece una experiencia completa: salón, sonido, luces, comida, bebidas, decoración y extras personalizables. Cotiza rápida y visualmente según tus necesidades.
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
