'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/quotes', label: 'Arma tu Evento' },
];

const NavLinksContent = ({
  pathname,
}: {
  pathname: string | null;
}) => (
  <nav
    className={cn(
      'flex items-center',
      'space-x-4 lg:space-x-6'
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
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Temática Eventos</span>
        </Link>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex">
                <NavLinksContent pathname={currentPathname} />
            </div>

            <div className='hidden md:flex items-center gap-2'>
              {user ? (
                  <Button onClick={signOut} variant="outline" size="sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Salir
                  </Button>
              ) : (
                  <>
                      <Button asChild variant="ghost" size="sm">
                          <Link href="/login">Ingresar</Link>
                      </Button>
                      <Button asChild size="sm">
                          <Link href="/signup">Registrarse</Link>
                      </Button>
                  </>
              )}
            </div>
        </div>
      </div>
    </header>
  );
}
