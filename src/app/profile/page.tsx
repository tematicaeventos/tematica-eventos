'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/firebase/auth';
import { LogOut, User as UserIcon, Mail, Phone, Handshake } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);
  
  if (isUserLoading || !user || !profile) {
    return <ProfileSkeleton />;
  }
  
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

  const handleAffiliateClick = () => {
    if (!profile) return;
    const message = `¡Hola! 👋 Estoy interesado/a en el programa de afiliados de Temática Eventos.\n\nMi nombre es *${profile.nombre}* y mi correo es *${profile.correo}*.`;
    const whatsappUrl = `https://wa.me/573045295251?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 md:py-12">
      <Card className="border-border/60">
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary/50">
              {/* The user object from firebase auth might have a photoURL */}
              <AvatarImage src={user.photoURL ?? undefined} alt={profile.nombre} />
              <AvatarFallback className="text-3xl bg-muted">
                {getInitials(profile.nombre)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-headline">{profile.nombre}</CardTitle>
            <CardDescription>Perfil de Usuario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4 p-3 bg-card rounded-md border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="text-muted-foreground">Correo Electrónico</p>
                    <p className="font-medium">{profile.correo}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-3 bg-card rounded-md border">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{profile.telefono}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-3 bg-card rounded-md border">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                 <div className="text-sm">
                    <p className="text-muted-foreground">Miembro desde</p>
                    <p className="font-medium">{new Date(profile.fechaRegistro).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
           
            <div className="pt-4 space-y-4">
              <Button onClick={handleAffiliateClick} size="lg" className="w-full h-12 text-lg">
                <Handshake className="mr-3 h-6 w-6" />
                Quiero ser Afiliado
              </Button>
              <Button onClick={() => signOut()} variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
    return (
        <div className="container mx-auto max-w-2xl py-8 md:py-12">
            <Card className="border-border/60">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center gap-4 p-3 bg-card rounded-md border">
                        <Skeleton className="h-5 w-5" />
                        <div className="w-full space-y-2">
                           <Skeleton className="h-4 w-1/3" />
                           <Skeleton className="h-5 w-2/3" />
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 bg-card rounded-md border">
                         <Skeleton className="h-5 w-5" />
                        <div className="w-full space-y-2">
                           <Skeleton className="h-4 w-1/3" />
                           <Skeleton className="h-5 w-1/2" />
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 bg-card rounded-md border">
                         <Skeleton className="h-5 w-5" />
                        <div className="w-full space-y-2">
                           <Skeleton className="h-4 w-1/3" />
                           <Skeleton className="h-5 w-2/3" />
                        </div>
                    </div>
                    <div className="pt-4 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}