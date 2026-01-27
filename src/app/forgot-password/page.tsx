'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendPasswordReset } from '@/firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const forgotPasswordFormSchema = z.object({
  email: z.string().email('Por favor, introduce un correo válido.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    try {
      await sendPasswordReset(data.email);
      toast({
        title: 'Correo enviado',
        description: 'Hemos enviado un enlace a tu correo para que puedas restablecer tu contraseña. Revisa tu bandeja de entrada (y spam).',
      });
      router.push('/login');
    } catch (error: any) {
      console.error("Error al enviar correo de recuperación:", error);
      let description = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      switch (error.code) {
        case 'auth/user-not-found':
          description =
            'No existe una cuenta con este correo. Verifica que lo hayas escrito bien.';
          break;
        case 'auth/invalid-email':
          description = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/too-many-requests':
          description =
            'Hemos bloqueado las solicitudes desde este dispositivo debido a actividad inusual. Inténtalo más tarde.';
          break;
        default:
          description = `No se pudo enviar el correo. Causa: ${error.message}`;
          break;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Introduce tu correo y te enviaremos un enlace para restablecerla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        {...field}
                        className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Correo de Recuperación'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya recordaste tu contraseña?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
