import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { BottomNav } from '@/components/bottom-nav';
import { PWAProvider } from '@/hooks/use-pwa';

export const metadata: Metadata = {
  title: 'Temática Eventos',
  description: 'Tu evento soñado, a un clic de distancia.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#f2c03d" />
      </head>
      <body className={cn('font-body antialiased', 'bg-background')}>
        <PWAProvider>
          <FirebaseClientProvider>
            <div className="relative flex min-h-dvh flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
              <BottomNav />
            </div>
            <Toaster />
          </FirebaseClientProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
