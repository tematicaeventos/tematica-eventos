'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { eventTypes } from '@/lib/data';
import { PLANES_BASE } from '@/lib/packaged-quote-data';
import { themeCategories } from '@/lib/themes-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Users,
  CalendarIcon,
  ShoppingCart,
  PartyPopper,
  CheckCircle2,
  Building,
  ArrowRight,
  Download,
  MapPin,
  User,
  Paintbrush,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { saveQuote } from '@/firebase/firestore';
import type { Quote, QuoteItem } from '@/lib/types';
import QuotePDFDocument from '@/components/QuotePDFDocument';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


const PRECIO_SALON = 1500000;

const baseIncludedServices = [
  {
    service: 'MENU Plato Tres Carnes',
    description: 'Entrada: Ensalada o creeps. Carnes: Cerdo, pollo, carne de res. Acompañamiento: Papa y arroz. Bebida: Jugo natural o gaseosa.',
  },
  { service: 'Bebidas Adicionales', description: 'Gaseosa, agua, cóctel ilimitado, champaña y whisky' },
  { service: 'Personal', description: 'Meseros, chef, barman y maestro de ceremonias' },
  { service: 'Menaje y mobiliario', description: 'Vajilla, mesas, sillas y mantelería' },
  { service: 'Sonido y DJ', description: 'Cabinas, luces, DJ y hora loca' },
  { service: 'Decoración', description: 'Centros de mesa, arco, silla quinceañera y tapete' },
  { service: 'Ponqué', description: 'Ponqué de 15 años decorado' },
  { service: 'Kit quinceañera', description: 'Cupcakes, rosas, cofre y cuadro' },
  { service: 'Fotografía y video', description: '50 fotos y video editado' },
  { service: 'Administración', description: 'Planeación, coordinación y montaje del evento' },
];

export default function PackagedQuotePage() {
  const params = useParams<{ eventType: string }>();
  const eventType = useMemo(() => eventTypes.find(e => e.id === params.eventType), [params]);

  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);

  // Quote State
  const [personas, setPersonas] = useState<number>(100);
  const [incluirSalon, setIncluirSalon] = useState<boolean>(true);
  const [direccionSalon, setDireccionSalon] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  
  // Client & Event Details State
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fecha, setFecha] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [horaInicio, setHoraInicio] = useState('20:00');
  const [horaFin, setHoraFin] = useState('03:00');

  // Control State
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> | null>(null);
  const [generatedQuoteId, setGeneratedQuoteId] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (profile) {
      setNombreCliente(profile.nombre);
      setTelefono(profile.telefono);
      setCorreo(profile.correo);
    }
  }, [profile]);

  const includedServices = useMemo(() => {
    if (!eventType) return baseIncludedServices;

    const services = JSON.parse(JSON.stringify(baseIncludedServices));

    if (eventType.id === 'matrimonios') {
        const kitIndex = services.findIndex((s: {service: string}) => s.service === 'Kit quinceañera');
        if (kitIndex !== -1) {
            services[kitIndex] = { service: 'Kit de matrimonio', description: 'Champaña para el brindis, copas decoradas' };
        }
        
        const decoracionIndex = services.findIndex((s: {service: string}) => s.service === 'Decoración');
        if (decoracionIndex !== -1) {
            services[decoracionIndex].description = 'Centros de mesa, arco de bodas y tapete';
        }

        const ponqueIndex = services.findIndex((s: {service: string}) => s.service === 'Ponqué');
        if (ponqueIndex !== -1) {
            services[ponqueIndex].description = 'Ponqué de matrimonio decorado';
        }
    } else if (eventType.id !== '15-anos') {
        const kitIndex = services.findIndex((s: {service: string}) => s.service === 'Kit quinceañera');
        if (kitIndex !== -1) {
            services.splice(kitIndex, 1);
        }
        
        const decoracionIndex = services.findIndex((s: {service: string}) => s.service === 'Decoración');
        if (decoracionIndex !== -1) {
            services[decoracionIndex].description = 'Centros de mesa, arco y tapete temático';
        }

        const ponqueIndex = services.findIndex((s: {service: string}) => s.service === 'Ponqué');
        if (ponqueIndex !== -1) {
            services[ponqueIndex].description = `Ponqué de ${eventType.title.toLowerCase()} decorado`;
        }
    }

    return services;
  }, [eventType]);

  const eventThemes = useMemo(() => {
    if (!eventType) return null;

    const themeCategoryMap: { [key: string]: string } = {
      '15-anos': '15-anos',
      matrimonios: 'matrimonios',
      'reuniones-empresariales': 'empresariales',
      'despedidas-empresa': 'despedidas',
    };

    const themeCategoryId = themeCategoryMap[eventType.id];
    if (!themeCategoryId) return null;

    return themeCategories.find((c) => c.id === themeCategoryId)?.themes;
  }, [eventType]);

  const planBase = useMemo(() => {
      let plan = PLANES_BASE.find(p => p.personas === personas);
      if (!plan) {
          plan = PLANES_BASE[0];
          setTimeout(() => setPersonas(PLANES_BASE[0].personas), 0);
      }
      return plan;
  }, [personas]);
  
  const total = useMemo(() => {
    let currentTotal = planBase.precio;
    if (!incluirSalon) {
        currentTotal -= PRECIO_SALON;
    }
    return currentTotal;
  }, [planBase, incluirSalon]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  async function handleSaveAndRedirect() {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Inicia sesión para continuar',
        description: 'Debes iniciar sesión para poder guardar tu cotización y continuar.',
      });
      router.push(`/login?redirect=/quote/${params.eventType}`);
      return;
    }
    
    if (!nombreCliente || !telefono || !correo) {
      toast({
        variant: 'destructive',
        title: 'Datos de contacto requeridos',
        description: 'Por favor, completa los campos de nombre, teléfono y correo.',
      });
      return;
    }

    if (!fecha) {
      toast({
        variant: 'destructive',
        title: 'Fecha requerida',
        description: 'Por favor, elige una fecha para tu evento.',
      });
      return;
    }

    if (!incluirSalon && !direccionSalon.trim()) {
      toast({
        variant: 'destructive',
        title: 'Dirección requerida',
        description: 'Por favor, introduce la dirección del lugar del evento.',
      });
      return;
    }

    if (!eventType) return;

    setIsSaving(true);
    
    const quoteItems: QuoteItem[] = [{
        categoria: `Paquete ${eventType.title}`,
        nombre: `Paquete todo incluido para ${personas} personas`,
        cantidad: 1,
        precioUnitario: total,
        subtotal: total,
    }];

    const quoteData: Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> = {
      usuarioId: user.uid,
      nombreCliente,
      correo,
      telefono,
      items: quoteItems,
      total,
      estado: 'pendiente',
      origen: 'web-paquete',
      tipoEvento: eventType.title,
      personas: personas,
      fechaEvento: format(fecha, 'yyyy-MM-dd'),
      horaInicio,
      horaFin,
      ...(selectedTheme && { tema: selectedTheme }),
      ...(!incluirSalon && direccionSalon.trim() ? { direccionSalon: direccionSalon.trim() } : {}),
      ...(direccion.trim() ? { direccion: direccion.trim() } : {}),
      ...(barrio.trim() ? { barrio: barrio.trim() } : {}),
      ...(observaciones.trim() ? { observaciones: observaciones.trim() } : {}),
    };

    try {
      const newQuoteId = await saveQuote(quoteData);
      toast({
        title: 'Cotización Guardada',
        description: `Tu cotización #${newQuoteId} ha sido guardada. Serás redirigido a WhatsApp para enviarla.`,
      });
      
      setGeneratedQuote(quoteData);
      setGeneratedQuoteId(newQuoteId);

      let message = `*Nueva Cotización de Paquete - ${eventType.title}*\n\n`;
      message += `*Cliente:* ${nombreCliente}\n`;
      message += `*Teléfono:* ${telefono}\n`;
      message += `*Correo:* ${correo}\n`;
      if (direccion) message += `*Dirección:* ${direccion}${barrio ? `, ${barrio}` : ''}\n`;
      if (observaciones.trim()) message += `*Observaciones:* ${observaciones.trim()}\n`;
      message += `\n*Cotización ID:* ${newQuoteId}\n`;
      message += `*Fecha del Evento:* ${format(fecha, "PPP", { locale: es })}\n`;
      message += `*Horario:* De ${horaInicio} a ${horaFin}\n`;
      message += `*Número de personas:* ${personas}\n`;
      if (selectedTheme) message += `*Temática:* ${selectedTheme}\n`;
      message += `\n*INCLUYE:*\n`;
      includedServices.forEach((item: any) => {
          message += `• ${item.service}${item.description ? `: ${item.description}` : ''}\n`;
      });
      if (incluirSalon) {
        message += `\n*Salón de eventos:* Sí, incluido en el precio\n\n`;
      } else if (direccionSalon.trim()) {
        message += `\n*Lugar del evento:* ${direccionSalon}\n\n`;
      }
      message += `*TOTAL: ${formatCurrency(total)}*\n\n`;
      message += `_Cotización generada desde la web._`;

      const whatsappUrl = `https://wa.me/573045295251?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');

    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la cotización.',
      });
    } finally {
      setIsSaving(false);
    }
}

  async function handleDownloadPDF() {
    if (!pdfRef.current || !generatedQuoteId || !generatedQuote) return;

    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling'],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`Cotizacion-${generatedQuoteId}.pdf`);
  }
  
  if (!eventType) {
    return <div>Evento no encontrado</div>;
  }

  return (
    <>
      <div ref={pdfRef} className="fixed -left-[9999px] top-0 z-[-1]">
        {generatedQuote && generatedQuoteId && (
          <QuotePDFDocument quoteId={generatedQuoteId} quote={generatedQuote as Quote} />
        )}
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            Cotizador de Paquetes para {eventType.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
            Nuestros paquetes todo incluido están diseñados para que no te preocupes por nada. Selecciona el número de invitados y reserva tu fecha.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* People Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Users className="text-primary"/> Número de Personas</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={personas.toString()} onValueChange={(val) => setPersonas(parseInt(val))} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {PLANES_BASE.map(plan => (
                    <Label key={plan.personas} htmlFor={`personas-${plan.personas}`} className="cursor-pointer flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-popover-foreground hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground">
                      <RadioGroupItem value={plan.personas.toString()} id={`personas-${plan.personas}`} className="sr-only" />
                      <span className="text-2xl font-bold">{plan.personas}</span>
                      <span className="text-sm opacity-80">personas</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            {eventThemes && (
              <Card className="bg-[hsl(var(--luminous-blue-bg))] border-[hsl(var(--luminous-blue-border))]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Paintbrush className="text-primary" /> Elige una Temática
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {eventThemes.map((theme) => {
                      const image = PlaceHolderImages.find(
                        (img) => img.id === theme.image
                      );
                      return (
                        <div
                          key={theme.title}
                          className={cn(
                            'w-40 flex-shrink-0 cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary',
                            selectedTheme === theme.title
                              ? 'border-primary ring-2 ring-primary ring-offset-2'
                              : 'border-muted'
                          )}
                          onClick={() =>
                            setSelectedTheme((prev) =>
                              prev === theme.title ? null : theme.title
                            )
                          }
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                            {image && (
                              <Image
                                src={image.imageUrl}
                                alt={theme.title}
                                fill
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                                sizes="160px"
                              />
                            )}
                          </div>
                          <p className="mt-2 text-center text-sm font-medium">
                            {theme.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Salon Selection */}
            <Card className="bg-white text-gray-900">
              <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Building className="text-primary"/> Salón de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                  <div 
                      className="flex items-center space-x-3 p-4 rounded-md border border-gray-200 bg-slate-50 cursor-pointer hover:bg-slate-100"
                      onClick={() => setIncluirSalon(!incluirSalon)}
                  >
                      <Checkbox id="incluir-salon" checked={incluirSalon} onCheckedChange={(checked) => setIncluirSalon(!!checked)} />
                      <Label htmlFor="incluir-salon" className="cursor-pointer flex-1">
                          <p className="font-semibold text-gray-800">Incluir salón de eventos en el paquete</p>
                          <p className="text-sm text-gray-600">Uso del salón y logística completa. Desmárcalo si ya tienes un lugar.</p>
                      </Label>
                  </div>
                   {!incluirSalon && (
                    <div className="mt-6 space-y-2">
                        <Label htmlFor="direccion-salon" className="flex items-center gap-2 font-semibold text-gray-800">
                            <MapPin className="h-4 w-4 text-primary" />
                            Dirección del lugar del evento
                        </Label>
                        <Input 
                            id="direccion-salon" 
                            placeholder="Ej: Calle 5 # 10-20, Bogotá"
                            value={direccionSalon}
                            onChange={(e) => setDireccionSalon(e.target.value)}
                            className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500"
                        />
                        <p className="text-xs text-gray-500">Este campo es obligatorio si no incluyes nuestro salón.</p>
                    </div>
                  )}
              </CardContent>
            </Card>
            
            {/* Included Services */}
            <Card className="border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><PartyPopper className="text-primary"/> Paquete Todo Incluido</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {includedServices.map((item: any) => (
                    <div key={item.service} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">{item.service}</p>
                        <p className="text-sm text-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
            </Card>
            
            {/* Client Details */}
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><User className="text-primary"/> Datos de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="nombre-cliente" className="font-semibold text-gray-800">Nombre de contacto</Label>
                    <Input id="nombre-cliente" placeholder="Nombre completo" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono-cliente" className="font-semibold text-gray-800">Teléfono (WhatsApp)</Label>
                    <Input id="telefono-cliente" type="tel" placeholder="3001234567" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="correo-cliente" className="font-semibold text-gray-800">Correo electrónico</Label>
                    <Input id="correo-cliente" type="email" placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="direccion-cliente" className="font-semibold text-gray-800">Dirección</Label>
                    <Input id="direccion-cliente" placeholder="Carrera 5 # 10-20" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="barrio-cliente" className="font-semibold text-gray-800">Barrio</Label>
                    <Input id="barrio-cliente" placeholder="El centro" value={barrio} onChange={(e) => setBarrio(e.target.value)} className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observaciones-cliente" className="font-semibold text-gray-800">Observaciones (opcional)</Label>
                  <Textarea id="observaciones-cliente" placeholder="Ej: alergias, preferencias especiales, etc." value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
              </CardContent>
            </Card>

            {/* Date and Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><CalendarIcon className="text-primary"/> Elige una Fecha</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal h-12"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fecha ? format(fecha, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fecha}
                      onSelect={(day) => {
                        setFecha(day);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      locale={es}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                      captionLayout="dropdown-buttons"
                      fromYear={currentYear}
                      toYear={currentYear + 5}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="hora-inicio">Hora de inicio</Label>
                      <input type="time" id="hora-inicio" className="w-full bg-input border border-border rounded-md p-3 mt-2 text-sm h-12" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="hora-fin">Hora de finalización</Label>
                      <input type="time" id="hora-fin" className="w-full bg-input border border-border rounded-md p-3 mt-2 text-sm h-12" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ShoppingCart className="text-primary" />
                  Resumen de tu Paquete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Paquete todo incluido para <span className="font-bold text-foreground">{personas} personas</span>.</p>
                {selectedTheme && (
                    <p className="mt-2 text-sm">Temática: <span className="font-semibold text-primary">{selectedTheme}</span></p>
                )}
                {!incluirSalon && (
                  <p className="text-sm text-primary/90 mt-2">No se incluye el salón de eventos.</p>
              )}
              </CardContent>
              <CardFooter className="flex-col gap-4 items-start">
                <div className="w-full flex justify-between font-bold text-2xl text-primary">
                  <span>TOTAL</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                
                {!generatedQuoteId ? (
                  <Button size="lg" className="w-full group h-auto py-3 whitespace-normal" onClick={handleSaveAndRedirect} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'continua, envia por WhastsApp y regresa a descargar tu pdf'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <div className='w-full text-center space-y-3'>
                    <p className='text-sm text-green-500 font-medium'>¡Cotización enviada a WhatsApp!</p>
                    <Button
                      onClick={handleDownloadPDF}
                      size="lg"
                      className="w-full group"
                      variant="outline"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Descargar PDF
                    </Button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground pt-2">El siguiente paso es iniciar sesión o registrarte para guardar tu cotización y proceder con la reserva.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
