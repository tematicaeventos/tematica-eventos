'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth';

const navLinks = [
  { href: '/', label: 'Inicio' },
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
    {navLinks.map((link) => {
      const linkComponent = (
        <Link
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
          suppressHydrationWarning
        >
          {link.label}
        </Link>
      );

      if (isMobile) {
        return (
          <SheetClose asChild key={link.href}>
            {linkComponent}
          </SheetClose>
        );
      }
      return <div key={link.href}>{linkComponent}</div>;
    })}
  </nav>
);

export function Header() {
  const { user } = useUser();
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

        <div className="flex items-center gap-4">
            <div className="hidden md:flex">
                <NavLinksContent pathname={currentPathname} />
            </div>

            {user ? (
                <Button onClick={signOut} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Salir
                </Button>
            ) : (
                <div className='hidden md:flex items-center gap-2'>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">Ingresar</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/signup">Registrarse</Link>
                    </Button>
                </div>
            )}

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
                        <NavLinksContent isMobile pathname={currentPathname} />
                         <Separator className="my-4" />
                         {user ? (
                            <SheetClose asChild>
                                <Button onClick={signOut} variant="outline">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Salir
                                </Button>
                            </SheetClose>
                         ) : (
                            <div className='flex flex-col gap-2'>
                                <SheetClose asChild>
                                    <Button asChild variant="ghost">
                                        <Link href="/login">Ingresar</Link>
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button asChild>
                                        <Link href="/signup">Registrarse</Link>
                                    </Button>
                                </SheetClose>
                            </div>
                         )}
                    </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
