'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/quotes', label: 'Cotizar' },
  { href: '/build', label: 'Arma tu Evento' },
];

const NavLinksContent = ({
  isMobile = false,
  pathname,
}: {
  isMobile?: boolean;
  pathname: string | null;
}) => (
  <nav
    className={cn(
      'flex items-center',
      isMobile
        ? 'flex-col space-y-4 text-lg items-start space-x-0'
        : 'space-x-4 lg:space-x-6'
    )}
  >
    {navLinks.map((link) =>
      isMobile ? (
        <SheetClose asChild key={link.href}>
          <Link
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === link.href
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            {link.label}
          </Link>
        </SheetClose>
      ) : (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      )
    )}
  </nav>
);

export function Header() {
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Temática Eventos</span>
        </Link>

        <div className="hidden md:flex">
          <NavLinksContent pathname={currentPathname} />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Alternar menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground">
              <SheetTitle className="sr-only">Menú</SheetTitle>
              <div className="flex flex-col p-6 pt-12">
                <NavLinksContent isMobile pathname={currentPathname} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
