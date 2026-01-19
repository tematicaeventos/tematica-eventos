'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ticket, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/recommendations', label: 'Recommendations' },
  { href: '/quotes', label: 'Instant Quote' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinks = ({
    className,
    onLinkClick,
  }: {
    className?: string;
    onLinkClick?: () => void;
  }) => (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary-foreground/80',
            pathname === link.href
              ? 'text-primary-foreground font-semibold'
              : 'text-primary-foreground/60'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary-foreground">
          <Ticket className="h-6 w-6" />
          <span className="font-headline text-lg">Vibrant Events</span>
        </Link>

        <div className="hidden md:flex">
          <NavLinks />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary-foreground" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-primary-foreground">
                <div className="flex flex-col p-6 pt-12">
                     <NavLinks className="flex-col space-y-4 text-lg items-start space-x-0" onLinkClick={() => document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click()} />
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
