'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Theme } from '@/lib/themes-data';

type ThemeCarouselProps = {
  themes: Theme[];
};

export function ThemeCarousel({ themes }: ThemeCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 py-4">
        {[...themes, ...themes].map((theme, index) => {
          const image = PlaceHolderImages.find((img) => img.id === theme.image);
          return (
            <div key={`${theme.title}-${index}`} className="relative flex-[0_0_90%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%]">
              <Card className="h-full w-full overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] w-full">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={theme.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg text-center font-semibold text-foreground">
                    {theme.title}
                  </CardTitle>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
