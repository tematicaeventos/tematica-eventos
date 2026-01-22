'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Home, Banknote, ArrowLeft } from 'lucide-react';
import { updateAffiliateData } from '@/firebase/firestore';

const editAffiliateFormSchema = z.object({
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
});

type EditAffiliateFormValues = z.infer<typeof editAffiliateFormSchema>;

export default function EditAffiliatePage() {
    const { user, affiliate, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EditAffiliateFormValues>({
        resolver: zodResolver(editAffiliateFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            documentId: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            address: '',
            paymentAccountHolder: '',
            paymentBank: '',
            paymentAccountNumber: '',
            paymentAlternative: '',
        },
    });
    
    useEffect(() => {
        if (!isUserLoading) {
            if (!user) {
                router.replace('/login?redirect=/profile');
            } else if (!affiliate) {
                router.replace('/profile');
            }
        }
    }, [isUserLoading, user, affiliate, router]);

    useEffect(() => {
        if (affiliate) {
            form.reset({
                firstName: affiliate.firstName,
                lastName: affiliate.lastName,
                documentId: affiliate.documentId,
                email: affiliate.email,
                phone: affiliate.phone,
                country: affiliate.country,
                city: affiliate.city,
                address: affiliate.address,
                paymentAccountHolder: affiliate.paymentAccountHolder,
                paymentAccountType: affiliate.paymentAccountType,
                paymentBank: affiliate.paymentBank,
                paymentAccountNumber: affiliate.paymentAccountNumber,
                paymentAlternative: affiliate.paymentAlternative || '',
            });
        }
    }, [affiliate, form]);

    async function onSubmit(data: EditAffiliateFormValues) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await updateAffiliateData(user.uid, data);
            toast({
                title: "Datos actualizados",
                description: "Tu información de afiliado ha sido actualizada correctamente.",
            });
            router.push('/profile');
        } catch (error) {
            console.error("Error updating affiliate data:", error);
            toast({
                variant: 'destructive',
                title: 'Error al actualizar',
                description: 'No se pudo guardar la información. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isUserLoading || !affiliate) {
        return (
             <div className="container max-w-3xl mx-auto py-8 md:py-12">
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                 </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto py-8 md:py-12">
            <Card>
                <CardHeader>
                    <Button asChild variant="ghost" size="sm" className="mb-4 w-fit -ml-3">
                      <Link href="/profile"><ArrowLeft className="mr-2 h-4 w-4" /> Volver al Perfil</Link>
                    </Button>
                    <CardTitle className="text-3xl">Mis Datos de Afiliado</CardTitle>
                    <CardDescription>Aquí puedes ver y actualizar tu información. Mantenla al día para asegurar que los pagos de comisiones se realicen correctamente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                             <section className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><UserIcon className="text-primary h-5 w-5"/> Datos Personales</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="firstName" render={({ field }) => <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="lastName" render={({ field }) => <FormItem><FormLabel>Apellidos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="documentId" render={({ field }) => <FormItem><FormLabel>Documento de identidad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Correo electrónico</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>} />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><Home className="text-primary h-5 w-5"/> Dirección</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="country" render={({ field }) => <FormItem><FormLabel>País</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="city" render={({ field }) => <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <div className="md:col-span-2">
                                    <FormField control={form.control} name="address" render={({ field }) => <FormItem><FormLabel>Dirección completa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><Banknote className="text-primary h-5 w-5"/> Datos de Pago</h3>
                                <p className="text-sm text-muted-foreground">Estos datos solo se usarán para el pago de comisiones.</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="paymentAccountHolder" render={({ field }) => <FormItem><FormLabel>Nombre del titular de la cuenta</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="paymentAccountType" render={({ field }) => <FormItem><FormLabel>Tipo de cuenta</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="ahorros">Ahorros</SelectItem><SelectItem value="corriente">Corriente</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="paymentBank" render={({ field }) => <FormItem><FormLabel>Banco</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <FormField control={form.control} name="paymentAccountNumber" render={({ field }) => <FormItem><FormLabel>Número de cuenta</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <div className="md:col-span-2">
                                    <FormField control={form.control} name="paymentAlternative" render={({ field }) => <FormItem><FormLabel>Medio de pago alternativo (opcional)</FormLabel><FormControl><Input placeholder="Ej: Nequi 3001234567" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    </div>
                                </div>
                            </section>
                            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
