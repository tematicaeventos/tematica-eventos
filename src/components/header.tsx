'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/quotes', label: 'Cotizar' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinksContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav
      className={cn(
        'flex items-center',
        isMobile
          ? 'flex-col space-y-4 text-lg items-start space-x-0'
          : 'space-x-4 lg:space-x-6'
      )}
    >
      {navLinks.map((link) => {
        const linkContent = (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {link.label}
          </Link>
        );

        if (isMobile) {
          return <SheetClose asChild key={link.href}>{linkContent}</SheetClose>;
        }
        return linkContent;
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Temática Eventos</span>
        </Link>

        <div className="hidden md:flex">
          <NavLinksContent />
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
                <div className="flex flex-col p-6 pt-12">
                     <NavLinksContent isMobile />
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
