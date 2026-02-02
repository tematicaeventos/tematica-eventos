'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Armchair,
  UtensilsCrossed,
  Speaker,
  Music,
  CupSoda,
  Sparkles,
  Layers3,
  ShoppingCart,
  Minus,
  Plus,
  ArrowRight,
  Download,
  CalendarIcon,
  MapPin,
  User,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import { useUser } from '@/firebase/auth/use-user';
import { saveQuote } from '@/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type {
  IndividualService,
  Quote,
  QuoteItem as QuoteItemType,
} from '@/lib/types';
import { services as allServices } from '@/lib/services-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import QuotePDFDocument from '@/components/QuotePDFDocument';
import { QuoteSummaryBar } from '@/components/quote-summary-bar';

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Sillas y Mesas': <Armchair className="h-5 w-5" />,
  Tarimas: <Layers3 className="h-5 w-5" />,
  'Sonido e Iluminación': <Speaker className="h-5 w-5" />,
  'Música y Animación': <Music className="h-5 w-5" />,
  Alimentación: <UtensilsCrossed className="h-5 w-5" />,
  Bebidas: <CupSoda className="h-5 w-5" />,
  Decoración: <Sparkles className="h-5 w-5" />,
};

const categoryColors: { [key: string]: string } = {
    'Sillas y Mesas': 'bg-[#2d3a34]/20 border-[hsl(var(--luminous-blue-border))] shadow-lg shadow-[hsl(var(--luminous-blue-border))]/20 hover:bg-[#2d3a34]/30 hover:-translate-y-1',
    'Tarimas': 'bg-indigo-900/20 border-indigo-700/40 shadow-lg shadow-indigo-700/20 hover:bg-indigo-900/30 hover:-translate-y-1',
    'Sonido e Iluminación': 'bg-emerald-900/20 border-emerald-700/40 shadow-lg shadow-emerald-700/20 hover:bg-emerald-900/30 hover:-translate-y-1',
    'Música y Animación': 'bg-rose-900/20 border-rose-700/40 shadow-lg shadow-rose-700/20 hover:bg-rose-900/30 hover:-translate-y-1',
    'Alimentación': 'bg-orange-900/20 border-orange-700/40 shadow-lg shadow-orange-700/20 hover:bg-orange-900/30 hover:-translate-y-1',
    'Bebidas': 'bg-cyan-900/20 border-cyan-700/40 shadow-lg shadow-cyan-700/20 hover:bg-cyan-900/30 hover:-translate-y-1',
    'Decoración': 'bg-fuchsia-900/20 border-fuchsia-700/40 shadow-lg shadow-fuchsia-700/20 hover:bg-fuchsia-900/30 hover:-translate-y-1',
};

type SelectedServices = {
  [serviceId: string]: {
    service: IndividualService;
    quantity: number;
  };
};

export default function ModularQuotePage() {
  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Quote State
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({});
  
  // Client & Event Details State
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [direccionSalon, setDireccionSalon] = useState('');
  const [fecha, setFecha] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [horaInicio, setHoraInicio] = useState('20:00');
  const [horaFin, setHoraFin] = useState('03:00');
  
  // Control State
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> | null>(null);
  const [generatedQuoteId, setGeneratedQuoteId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const bannerImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'build-event-banner'), []);

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

  useEffect(() => {
    if (profile) {
      setNombreCliente(profile.nombre);
      setTelefono(profile.telefono);
      setCorreo(profile.correo);
    }
  }, [profile]);

  const servicesByCategory = useMemo(() => {
    return allServices.reduce((acc, service) => {
      const category = service.categoria;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as { [key: string]: IndividualService[] });
  }, []);

  const handleServiceSelection = (
    service: IndividualService,
    isSelected: boolean
  ) => {
    if (!handleAuthCheck()) return;
    setSelectedServices((prev) => {
      const newSelection = { ...prev };
      if (isSelected) {
        newSelection[service.id] = { service, quantity: 1 };
      } else {
        delete newSelection[service.id];
      }
      return newSelection;
    });
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (!handleAuthCheck()) return;
    if (newQuantity < 1) {
      setSelectedServices((prev) => {
        const newSelection = { ...prev };
        delete newSelection[serviceId];
        return newSelection;
      });
    } else {
      setSelectedServices((prev) => ({
        ...prev,
        [serviceId]: { ...prev[serviceId], quantity: newQuantity },
      }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const quoteItems = useMemo<QuoteItemType[]>(() => {
    return Object.values(selectedServices).map(({ service, quantity }) => ({
      categoria: service.categoria,
      nombre: service.nombre,
      cantidad: quantity,
      precioUnitario: service.precioUnitario,
      subtotal: service.precioUnitario * quantity,
    }));
  }, [selectedServices]);

  const total = useMemo(
    () => quoteItems.reduce((acc, item) => acc + item.subtotal, 0),
    [quoteItems]
  );
  
  const handleScrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  async function handleContinueToReservation() {
    if (!handleAuthCheck() || !user || !profile) {
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

    if (quoteItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cotización vacía',
        description: 'Selecciona al menos un servicio.',
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

    setIsSaving(true);
    
    const personasItem = Object.values(selectedServices).find(({service}) => service.tipoCobro === 'persona');
    const personasCount = personasItem ? personasItem.quantity : 1;
    
    const quoteData: Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> = {
      usuarioId: user.uid,
      nombreCliente: nombreCliente,
      correo: correo,
      telefono: telefono,
      items: quoteItems,
      total: total,
      estado: 'pendiente',
      origen: 'web-modular',
      tipoEvento: 'Modular',
      personas: personasCount,
      fechaEvento: format(fecha, 'yyyy-MM-dd'),
      horaInicio: horaInicio,
      horaFin: horaFin,
      direccionSalon: direccionSalon.trim() || null,
      direccion: direccion.trim() || null,
      barrio: barrio.trim() || null,
      observaciones: observaciones.trim() || null,
    };

    try {
      const newQuoteId = await saveQuote(quoteData);
      toast({
        title: 'Cotización Guardada',
        description: `Tu cotización #${newQuoteId} ha sido guardada y enviada a WhatsApp.`,
      });
      
      setGeneratedQuote(quoteData);
      setGeneratedQuoteId(newQuoteId);
      
      let message = `*Nueva Cotización - Arma Tu Evento*\n\n`;
      message += `*Cliente:* ${nombreCliente}\n`;
      message += `*Correo:* ${correo}\n`;
      message += `*Teléfono:* ${telefono}\n`;
      if (direccion) message += `*Dirección:* ${direccion}${barrio ? `, ${barrio}` : ''}\n`;
      if (observaciones.trim()) message += `*Observaciones:* ${observaciones.trim()}\n`;
      
      message += `\n*Cotización ID:* ${newQuoteId}\n`;
      message += `*Fecha del Evento:* ${format(fecha, "PPP", { locale: es })}\n`;
      message += `*Horario:* De ${horaInicio} a ${horaFin}\n`;
      if (direccionSalon.trim()) {
        message += `*Lugar del Evento:* ${direccionSalon.trim()}\n`;
      }
      message += `---\n`;
      
      quoteItems.forEach(item => {
        message += `*${item.nombre}*\n`;
        message += `_Cant: ${item.cantidad} x ${formatCurrency(item.precioUnitario)} = ${formatCurrency(item.subtotal)}_\n\n`;
      });

      message += `---\n*TOTAL: ${formatCurrency(total)}*\n\n`;
      message += `_Cotización generada en el portal Temática Eventos... No solo hacemos eventos, creamos Recuerdos Inolvidables_`;

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
  };

  return (
    <>
       <QuoteSummaryBar total={total} onViewQuoteClick={handleScrollToSummary} />
       <div ref={pdfRef} className="fixed -left-[9999px] top-0 z-[-1]">
        {generatedQuote && generatedQuoteId && (
          <QuotePDFDocument quoteId={generatedQuoteId} quote={generatedQuote as Quote} />
        )}
      </div>
      <div className="bg-slate-900 text-gray-300 pt-16 md:pt-0 animate-fade-in-up">
        <section className="relative w-full h-[40vh] bg-black flex flex-col justify-center items-center text-center px-4">
          {bannerImage && (
            <Image
              src={bannerImage.imageUrl}
              alt={bannerImage.description}
              fill
              className="object-cover z-0 opacity-20"
              priority
              data-ai-hint={bannerImage.imageHint}
            />
          )}
          <div className="relative z-10 container mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white font-headline">
                Arma tu Evento
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
                Selecciona únicamente los servicios que necesitas y arma tu evento a tu
                medida. El valor se calcula automáticamente.
              </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Services Selection */}
            <div className="lg:col-span-2 space-y-4">
              <Accordion
                type="multiple"
                defaultValue={Object.keys(servicesByCategory)}
                className="w-full"
              >
                {Object.entries(servicesByCategory).map(([category, services]) => (
                  <AccordionItem value={category} key={category}>
                    <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                      <div className="flex items-center gap-3 text-primary">
                        {categoryIcons[category]}
                        <span>{category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={cn(
                              'flex items-center gap-4 p-3 rounded-lg border transition-all duration-300',
                              categoryColors[service.categoria] || 'bg-card/50'
                            )}
                          >
                            <Checkbox
                              id={service.id}
                              checked={!!selectedServices[service.id]}
                              onCheckedChange={(checked) =>
                                handleServiceSelection(service, !!checked)
                              }
                              className="h-5 w-5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <div className="flex-1 grid gap-1.5 leading-none">
                              <Label
                                htmlFor={service.id}
                                className="font-semibold text-base cursor-pointer text-white"
                              >
                                {service.nombre}
                              </Label>
                              <p className="text-sm text-slate-400">
                                {service.descripcion}
                              </p>
                              <p className="text-sm font-bold text-primary">
                                {formatCurrency(service.precioUnitario)}{' '}
                                <span className="font-normal text-xs text-slate-500">
                                  / {service.tipoCobro}
                                </span>
                              </p>
                            </div>
                            {selectedServices[service.id] && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-white text-black hover:bg-gray-200"
                                  onClick={() =>
                                    handleQuantityChange(
                                      service.id,
                                      selectedServices[service.id].quantity - 1
                                    )
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  className="w-16 h-8 text-center bg-white text-black"
                                  value={selectedServices[service.id].quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      service.id,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  min="0"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-white text-black hover:bg-gray-200"
                                  onClick={() =>
                                    handleQuantityChange(
                                      service.id,
                                      selectedServices[service.id].quantity + 1
                                    )
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Date and Quote Summary */}
            <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                <Card ref={summaryRef} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <ShoppingCart className="text-primary" />
                        Tu Cotización
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[50vh] overflow-y-auto">
                    {quoteItems.length > 0 ? (
                        quoteItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                        >
                            <div>
                            <p className="font-medium text-white">{item.nombre}</p>
                            <p className="text-slate-400">
                                {item.cantidad} x {formatCurrency(item.precioUnitario)}
                            </p>
                            </div>
                            <p className="font-semibold text-white">
                            {formatCurrency(item.subtotal)}
                            </p>
                        </div>
                        ))
                    ) : (
                        <p className="text-slate-400 text-center py-8">
                        Selecciona servicios para ver tu cotización.
                        </p>
                    )}
                    </CardContent>
                    <Separator className={cn('my-4 border-slate-700', quoteItems.length === 0 ? 'hidden' : '')} />
                    <CardFooter className="flex-col gap-4">
                    <div className="w-full flex justify-between font-bold text-xl text-white">
                        <span>TOTAL</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <Button
                    onClick={handleContinueToReservation}
                    size="lg"
                    className="w-full group h-auto py-3 whitespace-normal"
                    disabled={isSaving}
                    >
                    {isSaving ? 'Enviando...' : 'Enviar Cotización a WhatsApp'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><MapPin className="text-primary"/> Lugar del Evento</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Label htmlFor="direccion-salon">Si ya tienes un lugar, introduce la dirección</Label>
                      <Input 
                          id="direccion-salon" 
                          className="mt-2 bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500"
                          placeholder="Ej: Calle 5 # 10-20, Bogotá"
                          value={direccionSalon}
                          onChange={(e) => { if (handleAuthCheck()) setDireccionSalon(e.target.value) }}
                      />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><User className="text-primary"/> Datos de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre-cliente">Nombre de contacto</Label>
                        <Input id="nombre-cliente" placeholder="Nombre completo" value={nombreCliente} onChange={(e) => { if (handleAuthCheck()) setNombreCliente(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefono-cliente">Teléfono (WhatsApp)</Label>
                        <Input id="telefono-cliente" type="tel" placeholder="3001234567" value={telefono} onChange={(e) => { if (handleAuthCheck()) setTelefono(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="correo-cliente">Correo electrónico</Label>
                        <Input id="correo-cliente" type="email" placeholder="tu@correo.com" value={correo} onChange={(e) => { if (handleAuthCheck()) setCorreo(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="direccion-cliente">Dirección</Label>
                        <Input id="direccion-cliente" placeholder="Carrera 5 # 10-20" value={direccion} onChange={(e) => { if (handleAuthCheck()) setDireccion(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="barrio-cliente">Barrio</Label>
                        <Input id="barrio-cliente" placeholder="El centro" value={barrio} onChange={(e) => { if (handleAuthCheck()) setBarrio(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="observaciones-modular">Observaciones (opcional)</Label>
                        <Textarea id="observaciones-modular" placeholder="Ej: alergias, preferencias especiales, etc." value={observaciones} onChange={(e) => { if (handleAuthCheck()) setObservaciones(e.target.value) }} className="bg-white border-gray-300 text-gray-900 ring-offset-background focus-visible:ring-primary placeholder:text-gray-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CalendarIcon className="text-primary"/> Elige una Fecha</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4">
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
                          locale={es}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <Label htmlFor="hora-inicio">Hora de inicio</Label>
                          <input type="time" id="hora-inicio" className="w-full rounded-md border border-gray-300 bg-white p-3 mt-2 text-sm h-12 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background" value={horaInicio} onChange={(e) => { if (handleAuthCheck()) setHoraInicio(e.target.value) }} />
                      </div>
                      <div className="w-1/2">
                        <Label htmlFor="hora-fin">Hora de finalización</Label>
                          <input type="time" id="hora-fin" className="w-full rounded-md border border-gray-300 bg-white p-3 mt-2 text-sm h-12 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background" value={horaFin} onChange={(e) => { if (handleAuthCheck()) setHoraFin(e.target.value) }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
