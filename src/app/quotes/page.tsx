'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { serviceCategories } from '@/lib/services-data';
import type { SelectedService, ServiceItem, Quote, UserProfile } from '@/lib/types';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, Download, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { saveQuote } from '@/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import QuotePDFDocument from '@/components/QuotePDFDocument';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { eventTypes } from '@/lib/data';

export default function QuotesPage() {
  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const eventType = useMemo(() => (eventId ? eventTypes.find((e) => e.id === eventId) : null), [eventId]);

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  const handleServiceToggle = (service: ServiceItem, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, { ...service, quantity: 1 }]);
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    }
    setQuoteId(null);
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setSelectedServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, quantity: newQuantity } : s))
      );
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    }
    setQuoteId(null);
  };

  const total = useMemo(() => {
    return selectedServices.reduce((acc, service) => {
      return acc + service.price * service.quantity;
    }, 0);
  }, [selectedServices]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleGenerateQuote = async () => {
    if (!user || !profile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes iniciar sesión para generar una cotización.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const newQuote: Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> = {
        usuarioId: user.uid,
        nombreCliente: profile.nombre,
        correo: profile.correo,
        telefono: profile.telefono,
        items: selectedServices.map(s => ({
            categoria: serviceCategories.find(c => c.items.some(i => i.id === s.id))?.name || 'Desconocido',
            nombre: s.name,
            cantidad: s.quantity,
            precioUnitario: s.price,
            subtotal: s.price * s.quantity
        })),
        total: total,
        estado: 'pendiente',
        origen: 'web',
      };
      
      const newQuoteId = await saveQuote(newQuote);
      setQuoteId(newQuoteId);

      toast({
        title: 'Cotización Generada',
        description: 'Tu cotización ha sido guardada exitosamente.',
      });

    } catch (error) {
      console.error("Error saving quote: ", error);
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'No se pudo guardar tu cotización. Inténtalo de nuevo.',
      });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleDownloadPdf = () => {
    const input = pdfRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      let position = 0;
      if (height > pdfHeight) {
         position = - (height - pdfHeight) / 2
      }
      
      pdf.addImage(imgData, 'PNG', 0, position, width, height);
      pdf.save(`cotizacion-${quoteId}.pdf`);
    });
  };

  const handleWhatsAppRedirect = () => {
    if (!profile || !quoteId) return;

    const businessPhoneNumber = '573001234567'; // Reemplazar con el número del negocio
    const message = `Hola, soy ${profile.nombre}.
Acabo de generar la cotización ${quoteId}.
Total: ${formatCurrency(total)}.
Correo: ${profile.correo}
Teléfono: ${profile.telefono}`;

    const url = `https://wa.me/${businessPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (user === undefined || (user && profile === undefined)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       {/* Hidden element for PDF generation */}
       <div className="absolute left-[-9999px] top-[-9999px]" >
        <div ref={pdfRef} className="p-8 bg-white text-black w-[210mm]">
          {quoteId && profile && <QuotePDFDocument quoteId={quoteId} quote={{items: selectedServices, total}} user={profile} />}
        </div>
      </div>


      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          {eventType ? `Cotizador para ${eventType.title}` : 'Arma tu Evento a Medida'}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {eventType ? eventType.description : 'Selecciona los servicios que necesitas. El valor se calcula automáticamente.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="md:col-span-2">
          <Accordion type="multiple" className="w-full space-y-4" defaultValue={serviceCategories.map(c => c.id)}>
            {serviceCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <AccordionItem value={category.id} className="border-b-0">
                  <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-3">
                      <category.icon className="h-6 w-6 text-primary" />
                      {category.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="border-t border-border">
                        {category.items.map((item) => {
                          const selected = selectedServices.find(s => s.id === item.id);
                          return (
                            <div key={item.id} className={cn("p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/50", selected ? 'bg-card' : 'bg-background')}>
                              <div className="flex items-start gap-4">
                                <Checkbox
                                  id={item.id}
                                  checked={!!selected}
                                  onCheckedChange={(checked) => handleServiceToggle(item, !!checked)}
                                  className="mt-1"
                                />
                                <div>
                                  <Label htmlFor={item.id} className="font-bold text-base cursor-pointer">
                                    {item.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                  <p className="text-sm font-medium text-primary mt-1">
                                    {formatCurrency(item.price)} / {item.unit}
                                  </p>
                                </div>
                              </div>
                              {selected && (
                                <div className="flex items-center gap-2 self-center">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.id, selected.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    className="w-16 h-8 text-center"
                                    value={selected.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                    min="1"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.id, selected.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Tu Cotización
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedServices.length > 0 ? (
                <div className="space-y-4">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-muted-foreground">
                          {service.quantity} x {formatCurrency(service.price)}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <p className="font-semibold">
                          {formatCurrency(service.price * service.quantity)}
                        </p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleServiceToggle(service, false)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Selecciona servicios para ver tu cotización.
                </p>
              )}
            </CardContent>
            {selectedServices.length > 0 && (
                <CardFooter>
                  {!quoteId ? (
                      <Button onClick={handleGenerateQuote} className="w-full group" size="lg" disabled={isSaving}>
                          {isSaving ? 'Guardando...' : 'Generar Cotización'}
                          {!isSaving && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                      </Button>
                  ) : (
                    <div className='w-full flex flex-col gap-2'>
                        <Button onClick={handleDownloadPdf} className="w-full" size="lg" variant="outline">
                            <Download className="mr-2 h-5 w-5" />
                            Descargar PDF
                        </Button>
                        <Button onClick={handleWhatsAppRedirect} className="w-full" size="lg">
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Enviar por WhatsApp
                        </Button>
                    </div>
                  )}
                </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
