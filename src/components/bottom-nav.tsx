'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Puzzle, User, Paintbrush2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';

const navItems = [
  {
    href: '/',
    icon: Home,
    label: 'Inicio',
  },
  {
    href: '/quotes',
    icon: Puzzle,
    label: 'Arma tu Evento',
  },
  {
    href: '/themes',
    icon: Paintbrush2,
    label: 'Temáticas',
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = navItems.map((item) => {
    let isActive = false;
    if (item.href === '/') {
      isActive = pathname === '/';
    } else if (item.href === '/quotes') {
      isActive = pathname.startsWith('/quotes') || pathname.startsWith('/quote/');
    } else {
      isActive = pathname === item.href;
    }
    return { ...item, isActive };
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <nav className="flex h-16 items-stretch justify-around">
        {navLinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 p-2 text-sm font-medium transition-colors',
              item.isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs tracking-tight">{item.label}</span>
          </Link>
        ))}

        {user ? (
          <Link
            href="/profile"
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 p-2 text-sm font-medium transition-colors',
              pathname === '/profile'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs tracking-tight">Mi Perfil</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 p-2 text-sm font-medium transition-colors',
              (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs tracking-tight">Ingresar</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
