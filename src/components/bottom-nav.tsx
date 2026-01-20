'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Puzzle, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    {
      href: '/',
      icon: Home,
      label: 'Inicio',
      isActive: pathname === '/',
    },
    {
      href: '/quotes',
      icon: Puzzle,
      label: 'Cotizar',
      isActive: pathname.startsWith('/quotes') || pathname.startsWith('/quote/'),
    },
  ];

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
          <button
              onClick={() => signOut()}
              className="flex flex-1 flex-col items-center justify-center gap-1 p-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
              <LogOut className="h-5 w-5" />
              <span className="text-xs tracking-tight">Salir</span>
          </button>
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
