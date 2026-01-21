'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';

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

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Sillas y Mesas': <Armchair className="h-5 w-5" />,
  Tarimas: <Layers3 className="h-5 w-5" />,
  'Sonido e Iluminación': <Speaker className="h-5 w-5" />,
  'Música y Animación': <Music className="h-5 w-5" />,
  Alimentación: <UtensilsCrossed className="h-5 w-5" />,
  Bebidas: <CupSoda className="h-5 w-5" />,
  Decoración: <Sparkles className="h-5 w-5" />,
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
  const [isSaving, setIsSaving] = useState(false);

  const [selectedServices, setSelectedServices] = useState<SelectedServices>(
    {}
  );
  
  const bannerImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'build-event-banner'), []);

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

  const handleContinueToReservation = async () => {
    if (!user || !profile) {
      toast({
        variant: 'destructive',
        title: 'Inicia sesión para continuar',
        description:
          'Debes iniciar sesión para poder guardar tu cotización y continuar.',
      });
      router.push('/login?redirect=/quotes');
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

    setIsSaving(true);
    
    const personasItem = Object.values(selectedServices).find(({service}) => service.tipoCobro === 'persona');
    const personasCount = personasItem ? personasItem.quantity : 1;
    
    const quoteData: Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> = {
      usuarioId: user.uid,
      nombreCliente: profile.nombre,
      correo: profile.correo,
      telefono: profile.telefono,
      items: quoteItems,
      total,
      estado: 'pendiente',
      origen: 'web-modular',
      tipoEvento: 'Modular',
      personas: personasCount,
      fechaEvento: new Date().toISOString().split('T')[0], // Placeholder
      horaInicio: '00:00', // Placeholder
      horaFin: '00:00', // Placeholder
    };

    try {
      const newQuoteId = await saveQuote(quoteData);
      toast({
        title: 'Cotización Guardada',
        description: `Tu cotización #${newQuoteId} ha sido guardada. Serás redirigido a WhatsApp para enviarla.`,
      });
      
      let message = `*Nueva Cotización - Arma Tu Evento*\n\n`;
      message += `*Cliente:* ${profile.nombre}\n`;
      message += `*Correo:* ${profile.correo}\n`;
      message += `*Teléfono:* ${profile.telefono}\n\n`;
      message += `*Cotización ID:* ${newQuoteId}\n---\n`;
      
      quoteItems.forEach(item => {
        message += `*${item.nombre}*\n`;
        message += `_Cant: ${item.cantidad} x ${formatCurrency(item.precioUnitario)} = ${formatCurrency(item.subtotal)}_\n\n`;
      });

      message += `---\n*TOTAL: ${formatCurrency(total)}*\n\n`;
      message += `_Cotización generada desde la web._`;

      const whatsappUrl = `https://wa.me/573045295251?text=${encodeURIComponent(message)}`;
      
      window.location.href = whatsappUrl;

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
    <div>
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
                          className="flex items-center gap-4 p-3 rounded-lg border bg-card/50"
                        >
                          <Checkbox
                            id={service.id}
                            checked={!!selectedServices[service.id]}
                            onCheckedChange={(checked) =>
                              handleServiceSelection(service, !!checked)
                            }
                            className="h-5 w-5"
                          />
                          <div className="flex-1 grid gap-1.5 leading-none">
                            <Label
                              htmlFor={service.id}
                              className="font-semibold text-base cursor-pointer"
                            >
                              {service.nombre}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {service.descripcion}
                            </p>
                            <p className="text-sm font-bold text-primary">
                              {formatCurrency(service.precioUnitario)}{' '}
                              <span className="font-normal text-xs text-muted-foreground">
                                / {service.tipoCobro}
                              </span>
                            </p>
                          </div>
                          {selectedServices[service.id] && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
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
                                className="w-16 h-8 text-center"
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
                                className="h-8 w-8"
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

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
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
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-muted-foreground">
                          {item.cantidad} x {formatCurrency(item.precioUnitario)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Selecciona servicios para ver tu cotización.
                  </p>
                )}
              </CardContent>
              <Separator className={quoteItems.length === 0 ? 'hidden' : 'my-4'} />
              <CardFooter className="flex-col gap-4">
                <div className="w-full flex justify-between font-bold text-xl">
                  <span>TOTAL</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Button
                  onClick={handleContinueToReservation}
                  size="lg"
                  className="w-full group"
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Continuar y Enviar por WhatsApp'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
