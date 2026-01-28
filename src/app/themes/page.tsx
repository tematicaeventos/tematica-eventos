import { Sparkles } from '@/components/sparkles';
import { ThemeCarousel } from '@/components/theme-carousel';
import { themeCategories } from '@/lib/themes-data';
import { Separator } from '@/components/ui/separator';

export default function ThemesPage() {
  return (
    <div className="flex flex-col">
      <Sparkles />
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
              Temáticas para tu Evento
            </h1>
            <p className="mt-4 text-lg text-foreground/90 max-w-3xl mx-auto">
              Inspírate con nuestras ideas y encuentra el estilo perfecto para
              tu celebración. Hacemos realidad cualquier temática que imagines.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16 pb-16">
        {themeCategories.map((category, index) => (
          <section key={category.id}>
            <h2 className="text-3xl font-bold font-headline text-primary mb-2">
              {category.title}
            </h2>
            <p className="text-md text-muted-foreground mb-4 max-w-2xl">
                {category.description}
            </p>
            <ThemeCarousel themes={category.themes} />
            {index < themeCategories.length - 1 && <Separator className="mt-16" />}
          </section>
        ))}
      </div>
    </div>
  );
}
