
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Handshake, FileText, User as UserIcon, Home, Banknote, PartyPopper, Copy, Share2 } from 'lucide-react';
import { saveAffiliateData } from '@/firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from 'firebase/auth';

// Main component
export default function AffiliateFunnelPage() {
    const { user, profile, isUserLoading } = useUser();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [affiliateCode, setAffiliateCode] = useState<string | null>(null);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/login?redirect=/profile/affiliate');
        }
        if (!isUserLoading && user && profile?.isAffiliate) {
            router.replace('/profile');
        }
    }, [isUserLoading, user, profile, router]);

    const nextStep = () => setStep(s => s + 1);

    if (isUserLoading || !user || !profile) {
        return <div className="container py-12"><Skeleton className="w-full h-96" /></div>;
    }

    const progressValue = (step / 4) * 100;

    return (
        <div className="container max-w-3xl mx-auto py-8 md:py-12 animate-fade-in-up">
            {!affiliateCode && <Progress value={progressValue} className="mb-8" />}
            {step === 1 && <Step1 onNext={nextStep} />}
            {step === 2 && <Step2 onNext={nextStep} />}
            {step === 3 && <Step3 
                onSuccess={(code) => {
                    setAffiliateCode(code);
                    nextStep();
                }}
                setIsLoading={setIsLoading}
                user={user}
                profile={profile}
            />}
            {step === 4 && affiliateCode && <Step4 affiliateCode={affiliateCode} profile={profile} />}
        </div>
    );
}

// Step 1 Component
const Step1 = ({ onNext }: { onNext: () => void }) => (
    <Card>
        <CardHeader className="text-center">
            <Handshake className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl mt-4">Conviértete en Afiliado Oficial</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 max-w-xl mx-auto">
            <p className="text-lg">
                Recomienda clientes para eventos y gana el <strong>5% del valor del evento</strong> cuando se cierre.
            </p>
            <p className="text-foreground/90">No tiene costo ni riesgos. La empresa se encarga de la cotización, el cierre y la ejecución del evento.</p>
        </CardContent>
        <CardFooter>
            <Button onClick={onNext} className="w-full md:w-auto mx-auto bg-[hsl(var(--luminous-blue-bg))] text-foreground border border-[hsl(var(--luminous-blue-border))] shadow-lg shadow-[hsl(var(--luminous-blue-border))]/20 hover:bg-[hsl(var(--luminous-blue-bg))]/90" size="lg">Aceptar y continuar</Button>
        </CardFooter>
    </Card>
);

// Step 2 Component
const Step2 = ({ onNext }: { onNext: () => void }) => {
    const [accepted, setAccepted] = useState(false);
    return (
        <Card>
            <CardHeader className="text-center">
                <FileText className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="text-3xl mt-4">Condiciones del programa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl mx-auto">
                <ul className="list-disc space-y-2 pl-5 text-foreground">
                    <li>Comisión del <strong>5%</strong> por evento cerrado.</li>
                    <li>Aplica solo para <strong>clientes nuevos</strong> referidos por ti.</li>
                    <li>El afiliado <strong>no debe modificar precios</strong> ni condiciones.</li>
                    <li>La comisión se paga cuando el cliente ha confirmado y <strong>pagado el evento</strong> en su totalidad.</li>
                </ul>
                <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="accept" checked={accepted} onCheckedChange={(c) => setAccepted(!!c)} />
                    <Label htmlFor="accept" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                        Acepto las condiciones del programa de afiliados
                    </Label>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={onNext} disabled={!accepted} className="w-full md:w-auto mx-auto bg-[hsl(var(--luminous-blue-bg))] text-foreground border border-[hsl(var(--luminous-blue-border))] shadow-lg shadow-[hsl(var(--luminous-blue-border))]/20 hover:bg-[hsl(var(--luminous-blue-bg))]/90" size="lg">Continuar</Button>
            </CardFooter>
        </Card>
    );
};

// Step 3 Schema and Component
const affiliateFormSchema = z.object({
  firstName: z.string().min(2, "Nombre muy corto"),
  lastName: z.string().min(2, "Apellido muy corto"),
  documentId: z.string().min(5, "Documento no válido"),
  email: z.string().email("Correo no válido"),
  phone: z.string().min(7, "Teléfono no válido"),
  country: z.string().min(2, "País no válido"),
  city: z.string().min(2, "Ciudad no válida"),
  address: z.string().min(5, "Dirección no válida"),
  paymentAccountHolder: z.string().min(3, "Nombre no válido"),
  paymentAccountType: z.enum(["ahorros", "corriente"]),
  paymentBank: z.string().min(2, "Banco no válido"),
  paymentAccountNumber: z.string().min(5, "Número de cuenta no válido"),
  paymentAlternative: z.string().optional(),
  confirmInfo: z.boolean().refine(val => val === true, {
    message: "Debes confirmar que la información es correcta."
  }),
});

type AffiliateFormValues = z.infer<typeof affiliateFormSchema>;

interface Step3Props {
    onSuccess: (code: string) => void;
    setIsLoading: (loading: boolean) => void;
    user: User;
    profile: UserProfile;
}

const Step3 = ({ onSuccess, setIsLoading, user, profile }: Step3Props) => {
    const { toast } = useToast();

    const form = useForm<AffiliateFormValues>({
        resolver: zodResolver(affiliateFormSchema),
        defaultValues: {
            firstName: profile.nombre.split(' ')[0] || '',
            lastName: profile.nombre.split(' ').slice(1).join(' ') || '',
            email: profile.correo || '',
            phone: profile.telefono || '',
            country: 'Colombia',
            documentId: '',
            city: '',
            address: '',
            paymentAccountHolder: '',
            paymentBank: '',
            paymentAccountNumber: '',
            paymentAlternative: '',
            confirmInfo: false,
        },
    });

    async function onSubmit(data: AffiliateFormValues) {
        setIsLoading(true);
        try {
            const { confirmInfo, ...affiliateData } = data;
            const newAffiliateCode = await saveAffiliateData(user.uid, affiliateData);
            toast({
                title: "¡Felicitaciones!",
                description: "Tu afiliación se ha completado con éxito.",
            });
            onSuccess(newAffiliateCode);
        } catch (error) {
            console.error("Error saving affiliate data:", error);
            toast({
                variant: 'destructive',
                title: 'Error al finalizar',
                description: 'No se pudo completar tu afiliación. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="bg-background">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl">Completa tus datos como afiliado</CardTitle>
                <CardDescription>Esta información es necesaria para validar tu afiliación y realizar pagos de comisiones.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Section 1 */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><UserIcon className="text-primary h-5 w-5"/> Datos Personales</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => <FormItem><FormLabel className="text-foreground">Nombre</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="lastName" render={({ field }) => <FormItem><FormLabel className="text-foreground">Apellidos</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="documentId" render={({ field }) => <FormItem><FormLabel className="text-foreground">Documento de identidad</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel className="text-foreground">Correo electrónico</FormLabel><FormControl><Input type="email" {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel className="text-foreground">Teléfono</FormLabel><FormControl><Input type="tel" {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-4">
                             <h3 className="text-lg font-semibold flex items-center gap-2"><Home className="text-primary h-5 w-5"/> Dirección</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="country" render={({ field }) => <FormItem><FormLabel className="text-foreground">País</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="city" render={({ field }) => <FormItem><FormLabel className="text-foreground">Ciudad</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <div className="md:col-span-2">
                                  <FormField control={form.control} name="address" render={({ field }) => <FormItem><FormLabel className="text-foreground">Dirección completa</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                </div>
                             </div>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-4">
                             <h3 className="text-lg font-semibold flex items-center gap-2"><Banknote className="text-primary h-5 w-5"/> Datos de Pago</h3>
                             <p className="text-sm text-muted-foreground">Estos datos solo se usarán para el pago de comisiones.</p>
                             <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="paymentAccountHolder" render={({ field }) => <FormItem><FormLabel className="text-foreground">Nombre del titular de la cuenta</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="paymentAccountType" render={({ field }) => <FormItem><FormLabel className="text-foreground">Tipo de cuenta</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary"><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="ahorros">Ahorros</SelectItem><SelectItem value="corriente">Corriente</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="paymentBank" render={({ field }) => <FormItem><FormLabel className="text-foreground">Banco</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="paymentAccountNumber" render={({ field }) => <FormItem><FormLabel className="text-foreground">Número de cuenta</FormLabel><FormControl><Input {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                <div className="md:col-span-2">
                                   <FormField control={form.control} name="paymentAlternative" render={({ field }) => <FormItem><FormLabel className="text-foreground">Medio de pago alternativo (opcional)</FormLabel><FormControl><Input placeholder="Ej: Nequi 3001234567" {...field} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>} />
                                </div>
                             </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <FormField control={form.control} name="confirmInfo" render={({ field }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Confirmo que la información suministrada es correcta</FormLabel><FormMessage /></div></FormItem>} />
                        </section>

                        <Button type="submit" size="lg" className="w-full">Finalizar afiliación</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};


// Step 4 Component
const Step4 = ({ affiliateCode, profile }: { affiliateCode: string; profile: UserProfile; }) => {
    const { toast } = useToast();
    const router = useRouter();

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({ title: '¡Copiado!', description: 'Tu código de afiliado ha sido copiado al portapapeles.' });
    };

    const handleShareLink = async (code: string) => {
        const shareUrl = `${window.location.origin}?ref=${code}`;
        if (navigator.share) {
          try {
            await navigator.share({
                title: 'Conviértete en mi referido en Temática Eventos',
                text: `¡Usa mi código ${code} al registrarte en Temática Eventos!`,
                url: shareUrl,
            });
          } catch (error) {
            navigator.clipboard.writeText(shareUrl);
            toast({ title: '¡Enlace copiado!', description: 'No se pudo abrir el diálogo para compartir, pero hemos copiado el enlace a tu portapapeles.' });
          }
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast({ title: '¡Enlace copiado!', description: 'El enlace de referido ha sido copiado.' });
        }
    };
    
    return (
        <Card className="text-center">
            <CardHeader>
                <PartyPopper className="mx-auto h-16 w-16 text-green-500" />
                <CardTitle className="text-3xl mt-4">🎉 ¡Ya eres Afiliado Oficial!</CardTitle>
                <CardDescription>{profile.nombre}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Comparte tu código y gana el 5% por cada evento cerrado.</p>
                <div className="w-full max-w-sm mx-auto">
                    <Label>Tu código de afiliado</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Input readOnly value={affiliateCode} className="font-mono text-2xl tracking-widest text-center h-12" />
                        <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleCopyCode(affiliateCode)}>
                            <Copy />
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col md:flex-row gap-4">
                <Button onClick={() => handleShareLink(affiliateCode)} className="w-full" size="lg">
                    <Share2 className="mr-2" /> Compartir Enlace
                </Button>
                <Button onClick={() => router.push('/profile')} className="w-full" size="lg" variant="outline">
                    Ir a mi Perfil
                </Button>
            </CardFooter>
        </Card>
    );
};
