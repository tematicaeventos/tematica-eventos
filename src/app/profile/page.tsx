'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/firebase/auth';
import { LogOut, User as UserIcon, Mail, Phone, Handshake, Copy, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

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
    router.push('/profile/affiliate');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: '¡Copiado!', description: 'Tu código de afiliado ha sido copiado al portapapeles.' });
  };
  
  const handleShareLink = (code: string) => {
    const shareUrl = `${window.location.origin}?ref=${code}`;
    if (navigator.share) {
        navigator.share({
            title: 'Únete a Temática Eventos con mi código',
            text: `¡Usa mi código de afiliado ${code} al cotizar en Temática Eventos!`,
            url: shareUrl,
        });
    } else {
        navigator.clipboard.writeText(shareUrl);
        toast({ title: '¡Enlace copiado!', description: 'El enlace de referido ha sido copiado.' });
    }
  };


  return (
    <div className="container mx-auto max-w-2xl py-8 md:py-12">
      <Card className="border-border/60">
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary/50">
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
              {!profile.isAffiliate ? (
                <Button onClick={handleAffiliateClick} size="lg" className="w-full h-12 text-lg">
                  <Handshake className="mr-3 h-6 w-6" />
                  Quiero ser Afiliado
                </Button>
              ) : (
                <Card className="bg-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Handshake className="text-primary"/>
                      Mi Afiliación
                    </CardTitle>
                    <CardDescription>Estado: Afiliado Activo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Tu código de afiliado</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input readOnly value={profile.affiliateCode || ''} className="font-mono text-lg tracking-widest" />
                        <Button variant="outline" size="icon" onClick={() => handleCopyCode(profile.affiliateCode!)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Comparte este código y gana el 5 % por cada evento cerrado.</p>
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" onClick={() => handleShareLink(profile.affiliateCode!)}>
                          <Share2 className="mr-2 h-4 w-4"/>
                          Compartir Enlace
                      </Button>
                  </CardFooter>
                </Card>
              )}
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
