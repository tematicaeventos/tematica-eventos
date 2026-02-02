
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
import { QuoteSummaryBar } from '@/components/quote-summary-bar';
import { Confetti } from '@/components/confetti';


const PRECIO_SALON = 1500000;

export default function PackagedQuotePage() {
  const params = useParams<{ eventType: string }>();
  const eventType = useMemo(() => eventTypes.find(e => e.id === params.eventType), [params]);

  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleAuthCheck = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Acción requerida',
        description: 'Inicia sesión o regístrate para continuar con la cotización.',
      });
      router.push(`/login?redirect=${window.location.pathname}`);
      return false;
    }
    return true;
  };
  
  // Services Config
  const packagedServicesConfig = useMemo(() => [
    { id: 'menu', service: 'MENU Plato Tres Carnes', description: 'Entrada: Ensalada o creeps. Carnes: Cerdo, pollo, carne de res. Acompañamiento: Papa y arroz. Bebida: Jugo natural o gaseosa.', value: (p: number) => p * 40000, removable: true },
    { id: 'bebidas', service: 'Bebidas Adicionales', description: 'Gaseosa, agua, cóctel ilimitado, champaña y whisky', value: (p: number) => p * 15000, removable: true },
    { id: 'personal', service: 'Personal', description: 'Meseros, chef, barman y maestro de ceremonias', value: () => 800000, removable: true },
    { id: 'menaje', service: 'Menaje y mobiliario', description: 'Vajilla, mesas, sillas y mantelería', value: () => 700000, removable: true },
    { id: 'sonido', service: 'Sonido y DJ', description: 'Cabinas, luces, DJ y hora loca', value: () => 600000, removable: true },
    { id: 'decoracion', service: 'Decoración', description: 'Centros de mesa, arco, silla quinceañera y tapete', value: () => 750000, removable: true },
    { id: 'ponque', service: 'Ponqué', description: 'Ponqué temático decorado', value: () => 200000, removable: true },
    { id: 'kit', service: 'Kit especial', description: 'Kit quinceañera (Cupcakes, rosas, cofre, cuadro)', value: () => 150000, removable: true },
    { id: 'foto', service: 'Fotografía y video', description: '50 fotos y video editado', value: () => 320000, removable: true },
    { id: 'admin', service: 'Administración', description: 'Planeación, coordinación y montaje del evento', value: () => 0, removable: false },
  ], []);

  const finalPackagedServices = useMemo(() => {
    if (!eventType) return packagedServicesConfig;

    // Use map for a shallow copy, preserving functions.
    const baseServices = packagedServicesConfig.map(s => ({ ...s }));

    if (eventType.id === 'matrimonios') {
        return baseServices.map(service => {
            const newService = { ...service };
            if (newService.id === 'kit') {
                newService.service = 'Kit de matrimonio';
                newService.description = 'Champaña para el brindis, copas decoradas';
            }
            if (newService.id === 'decoracion') {
                newService.description = 'Centros de mesa, arco de bodas y tapete';
            }
            if (newService.id === 'ponque') {
                newService.description = 'Ponqué de matrimonio decorado';
            }
            return newService;
        });
    }

    if (eventType.id !== '15-anos') {
        // Filter first, then map to modify.
        return baseServices
            .filter(s => s.id !== 'kit')
            .map(service => {
                const newService = { ...service };
                if (newService.id === 'decoracion') {
                    newService.description = 'Centros de mesa, arco y tapete temático';
                }
                if (newService.id === 'ponque') {
                    newService.description = `Ponqué de ${eventType.title.toLowerCase()} decorado`;
                }
                return newService;
            });
    }

    // For '15-anos', return the original config (or a copy)
    return baseServices;
}, [eventType, packagedServicesConfig]);

  // Quote State
  const [personas, setPersonas] = useState<number>(100);
  const [incluirSalon, setIncluirSalon] = useState<boolean>(true);
  const [direccionSalon, setDireccionSalon] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const initialServiceIds = useMemo(() => 
      new Set(finalPackagedServices.filter(s => s.removable !== false).map(s => s.id))
  , [finalPackagedServices]);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(initialServiceIds);
  
  useEffect(() => {
      setSelectedServices(initialServiceIds);
  }, [initialServiceIds]);

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

    finalPackagedServices.forEach(service => {
        if (service.removable !== false && !selectedServices.has(service.id)) {
            currentTotal -= service.value(personas);
        }
    });

    return currentTotal;
  }, [planBase, incluirSalon, selectedServices, personas, finalPackagedServices]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handleScrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function handleSaveAndRedirect() {
    if (!handleAuthCheck()) {
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
        description: 'Este campo es obligatorio. Si no tienes un lugar, indícanos el sector de tu preferencia y nosotros te ayudaremos a conseguirlo.',
      });
      return;
    }

    if (!eventType) return;

    setIsSaving(true);
    
    const deselectedServices = finalPackagedServices
      .filter(s => s.removable !== false && !selectedServices.has(s.id))
      .map(s => s.service);
      
    const quoteItems: QuoteItem[] = [{
        categoria: `Paquete ${eventType.title}`,
        nombre: `Paquete todo incluido para ${personas} personas ${deselectedServices.length > 0 ? '(con exclusiones)' : ''}`,
        cantidad: 1,
        precioUnitario: total,
        subtotal: total,
    }];

    let finalObservaciones = observaciones.trim();
    if (deselectedServices.length > 0) {
      const deselectedString = `Servicios excluidos del paquete: ${deselectedServices.join(', ')}.`;
      finalObservaciones = finalObservaciones ? `${finalObservaciones}\n${deselectedString}` : deselectedString;
    }

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
      ...(finalObservaciones ? { observaciones: finalObservaciones } : {}),
    };

    try {
      const newQuoteId = await saveQuote(quoteData);
      toast({
        title: 'Cotización Guardada',
        description: `Tu cotización #${newQuoteId} ha sido guardada y enviada a WhatsApp.`,
      });
      
      setGeneratedQuote(quoteData);
      setGeneratedQuoteId(newQuoteId);

      let message = `*Nueva Cotización de Paquete - ${eventType.title}*\n\n`;
      message += `*Cliente:* ${nombreCliente}\n`;
      message += `*Teléfono:* ${telefono}\n`;
      message += `*Correo:* ${correo}\n`;
      if (direccion) message += `*Dirección:* ${direccion}${barrio ? `, ${barrio}` : ''}\n`;
      if (observaciones.trim()) message += `*Observaciones del cliente:* ${observaciones.trim()}\n`;
      message += `\n*Cotización ID:* ${newQuoteId}\n`;
      message += `*Fecha del Evento:* ${format(fecha, "PPP", { locale: es })}\n`;
      message += `*Horario:* De ${horaInicio} a ${horaFin}\n`;
      message += `*Número de personas:* ${personas}\n`;
      if (selectedTheme) message += `*Temática:* ${selectedTheme}\n`;

      message += `\n*INCLUYE:*\n`;
      finalPackagedServices.forEach((item: any) => {
          if (selectedServices.has(item.id)) {
            message += `• ${item.service}\n`;
          }
      });
      
      if(deselectedServices.length > 0) {
        message += `\n*SERVICIOS EXCLUIDOS:*\n${deselectedServices.map(s => `• ${s}`).join('\n')}\n`;
      }
      
      if (incluirSalon) {
        message += `\n*Salón de eventos:* Sí, incluido en el precio\n\n`;
      } else if (direccionSalon.trim()) {
        message += `\n*Lugar del evento:* ${direccionSalon}\n\n`;
      }
      message += `*TOTAL: ${formatCurrency(total)}*\n\n`;
      message += `_Cotización generada desde la web._`;

      const whatsappUrl = `https://wa.me/573112410969?text=${encodeURIComponent(message)}`;
      
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
  
  if (!eventType) {
    return <div>Evento no encontrado</div>;
  }

  return (
    <>
      <Confetti />
      <QuoteSummaryBar total={total} onViewQuoteClick={handleScrollToSummary} />
      <div ref={pdfRef} className="fixed -left-[9999px] top-0 z-[-1]">
        {generatedQuote && generatedQuoteId && (
          <QuotePDFDocument quoteId={generatedQuoteId} quote={generatedQuote as Quote} />
        )}
      </div>
      <div className="container mx-auto px-4 pt-20 pb-8 md:py-8 animate-fade-in-up">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            Cotizador de Paquetes para {eventType.title}
          </h1>
          <p className="mt-2 text-lg max-w-3xl mx-auto text-foreground [text-shadow:0_0_12px_white]">
            Nuestros paquetes todo incluido están diseñados para que no te preocupes por nada. Selecciona el número de invitados y reserva tu fecha.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* People Selection */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Users className="text-primary"/> Número de Personas</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={personas.toString()} onValueChange={(val) => { if (handleAuthCheck()) setPersonas(parseInt(val)) }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <Card className="border-primary">
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
                          onClick={() => {
                            if (handleAuthCheck()) {
                                setSelectedTheme((prev) =>
                                prev === theme.title ? null : theme.title
                                )
                            }
                          }}
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
            <Card className="border-primary">
              <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Building className="text-primary"/> Salón de Eventos</CardTitle>
                  <p className="pt-2 text-white">(Nuestras sedes: Kennedy, Bosa, Soacha). En caso de que no desees el salón en estas locaciones, desmarca la casilla.</p>
              </CardHeader>
              <CardContent>
                  <div 
                      className="flex items-center space-x-3 p-4 rounded-md border border-gray-200 bg-white cursor-pointer hover:bg-gray-100"
                      onClick={() => { if (handleAuthCheck()) setIncluirSalon(!incluirSalon) }}
                  >
                      <Checkbox id="incluir-salon" checked={incluirSalon} onCheckedChange={(checked) => { if (handleAuthCheck()) setIncluirSalon(!!checked) }} />
                      <Label htmlFor="incluir-salon" className="cursor-pointer flex-1">
                          <p className="font-semibold text-gray-800">Incluir salón de eventos en el paquete</p>
                          <p className="text-sm text-gray-600">Uso del salón y logística completa.</p>
                      </Label>
                  </div>
                   {!incluirSalon && (
                    <div className="mt-6 space-y-2">
                        <Label htmlFor="direccion-salon" className="flex items-center gap-2 font-semibold text-white text-xl [text-shadow:0_0_12px_white]">
                            <MapPin className="h-5 w-5 text-primary" />
                            Dirección del lugar del evento
                        </Label>
                        <Input 
                            id="direccion-salon" 
                            placeholder="Ej: Calle 5 # 10-20, Bogotá"
                            value={direccionSalon}
                            onChange={(e) => { if (handleAuthCheck()) setDireccionSalon(e.target.value) }}
                            className="bg-white border-gray-300 text-gray-900 ring-offset-white focus-visible:ring-primary placeholder:text-gray-500"
                        />
                        <p className="text-lg text-white">Este campo es obligatorio. Si no tienes un lugar, indícanos el sector de tu preferencia y nosotros te ayudaremos a conseguirlo.</p>
                    </div>
                  )}
              </CardContent>
            </Card>
            
            {/* Included Services */}
            <Card className="border-primary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><PartyPopper className="text-primary"/> Paquete Todo Incluido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {finalPackagedServices.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card/50">
                      <Checkbox
                        id={`service-${item.id}`}
                        checked={selectedServices.has(item.id)}
                        onCheckedChange={(checked) => {
                            if (handleAuthCheck()) {
                                setSelectedServices(prev => {
                                    const newSelection = new Set(prev);
                                    if (checked) {
                                    newSelection.add(item.id);
                                    } else {
                                    newSelection.delete(item.id);
                                    }
                                    return newSelection;
                                });
                            }
                        }}
                        disabled={item.removable === false}
                        className="h-5 w-5 mt-1"
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <Label
                          htmlFor={`service-${item.id}`}
                          className="font-semibold text-base cursor-pointer text-white"
                        >
                          {item.service}
                        </Label>
                        <p className="text-sm text-white">{item.description}</p>
                         {item.removable !== false && !selectedServices.has(item.id) && (
                            <p className="text-sm font-bold text-red-500">
                                -{formatCurrency(item.value(personas))}
                            </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
            </Card>
            
            {/* Client Details */}
            <Card className="border-primary bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><User className="text-primary"/> Datos de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background">
                <div className="space-y-2">
                    <Label htmlFor="nombre-cliente" className="text-foreground">Nombre de contacto</Label>
                    <Input id="nombre-cliente" placeholder="Nombre completo" value={nombreCliente} onChange={(e) => { if (handleAuthCheck()) setNombreCliente(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono-cliente" className="text-foreground">Teléfono (WhatsApp)</Label>
                    <Input id="telefono-cliente" type="tel" placeholder="3001234567" value={telefono} onChange={(e) => { if (handleAuthCheck()) setTelefono(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="correo-cliente" className="text-foreground">Correo electrónico</Label>
                    <Input id="correo-cliente" type="email" placeholder="tu@correo.com" value={correo} onChange={(e) => { if (handleAuthCheck()) setCorreo(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="direccion-cliente" className="text-foreground">Dirección</Label>
                    <Input id="direccion-cliente" placeholder="Carrera 5 # 10-20" value={direccion} onChange={(e) => { if (handleAuthCheck()) setDireccion(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="barrio-cliente" className="text-foreground">Barrio</Label>
                    <Input id="barrio-cliente" placeholder="El centro" value={barrio} onChange={(e) => { if (handleAuthCheck()) setBarrio(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observaciones-cliente" className="text-foreground">Observaciones (opcional)</Label>
                  <Textarea id="observaciones-cliente" placeholder="Ej: alergias, preferencias especiales, etc." value={observaciones} onChange={(e) => { if (handleAuthCheck()) setObservaciones(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                </div>
              </CardContent>
            </Card>

            {/* Date and Time */}
            <Card className="border-primary bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><CalendarIcon className="text-primary"/> Elige una Fecha</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal h-12 bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
                       onClick={() => { if (handleAuthCheck()) setIsCalendarOpen(true) }}
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
                        if (handleAuthCheck()) {
                            setFecha(day);
                            setIsCalendarOpen(false);
                        }
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
                    <Label htmlFor="hora-inicio" className="text-foreground">Hora de inicio</Label>
                      <input type="time" id="hora-inicio" className="w-full rounded-md border border-gray-300 bg-white p-3 mt-2 text-sm h-12 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background" value={horaInicio} onChange={(e) => { if (handleAuthCheck()) setHoraInicio(e.target.value) }} />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="hora-fin" className="text-foreground">Hora de finalización</Label>
                      <input type="time" id="hora-fin" className="w-full rounded-md border border-gray-300 bg-white p-3 mt-2 text-sm h-12 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background" value={horaFin} onChange={(e) => { if (handleAuthCheck()) setHoraFin(e.target.value) }} />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-24" ref={summaryRef}>
            <Card className="border-primary">
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
                
                <Button size="lg" className="w-full group h-auto py-3 whitespace-normal" onClick={handleSaveAndRedirect} disabled={isSaving}>
                  {isSaving ? 'Enviando...' : 'Enviar Cotización a WhatsApp'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-xs text-muted-foreground pt-2">El siguiente paso es iniciar sesión o registrarte para guardar tu cotización y proceder con la reserva.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
