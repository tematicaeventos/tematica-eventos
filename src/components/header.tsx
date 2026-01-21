'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Home, Paintbrush2, Puzzle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/quotes', label: 'Arma tu Evento', icon: Puzzle },
  { href: '/themes', label: 'Temáticas', icon: Paintbrush2 },
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
      const Icon = link.icon;
      const linkComponent = (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
          suppressHydrationWarning
        >
          <Icon className="h-4 w-4" />
          {link.label}
        </Link>
      );

      return <div key={link.href}>{linkComponent}</div>;
    })}
  </nav>
);

export function Header() {
  const { user, profile } = useUser();
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (name.length > 1) {
        return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase();
  };

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

            <div className='hidden md:flex items-center gap-4'>
              {user && profile ? (
                   <Link href="/profile" className='flex items-center gap-2'>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL ?? undefined} alt={profile.nombre} />
                            <AvatarFallback>{getInitials(profile.nombre)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground hover:text-primary">{profile.nombre}</span>
                   </Link>
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
