'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { eventTypes } from '@/lib/data';
import { PLANES_BASE } from '@/lib/packaged-quote-data';
import {
  Users,
  CalendarIcon,
  ShoppingCart,
  PartyPopper,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const baseIncludedServices = [
  { service: 'Salón de eventos', description: 'Uso del salón y logística' },
  {
    service: 'Plato Tres Carnes',
    description: 'Menú completo servido en la mesa.',
    details: [
      'Entrada: Ensalada o creeps',
      'Carnes: Cerdo, pollo, carne de res',
      'Acompañamiento',
      'Bebida: Jugo natural o gaseosa',
    ],
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

  const [personas, setPersonas] = useState<number>(100);
  const [fecha, setFecha] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const planBase = useMemo(() => {
      let plan = PLANES_BASE.find(p => p.personas === personas);
      if (!plan) {
          plan = PLANES_BASE[0];
          // This effect will update the state in the next render cycle
          setTimeout(() => setPersonas(PLANES_BASE[0].personas), 0);
      }
      return plan;
  }, [personas]);
  
  const total = useMemo(() => {
    return planBase.precio;
  }, [planBase]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  if (!eventType) {
    return <div>Evento no encontrado</div>;
  }

  return (
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
                  <Label key={plan.personas} htmlFor={`personas-${plan.personas}`} className="cursor-pointer flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value={plan.personas.toString()} id={`personas-${plan.personas}`} className="sr-only" />
                    <span className="text-2xl font-bold">{plan.personas}</span>
                    <span className="text-sm text-muted-foreground">personas</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Included Services */}
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-3"><PartyPopper className="text-primary"/> Paquete Todo Incluido</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {includedServices.map((item: any) => {
                  if (item.details) {
                    return (
                      <div key={item.service} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <Accordion type="single" collapsible className="w-full -mt-1.5">
                          <AccordionItem value={item.service} className="border-b-0">
                            <AccordionTrigger className="p-0 py-1.5 text-left hover:no-underline">
                              <div>
                                <p className="font-semibold">{item.service}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                                {item.details.map((detail: string, i: number) => <li key={i}>{detail}</li>)}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    );
                  }
                  return (
                    <div key={item.service} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold">{item.service}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
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
                  />
                </PopoverContent>
              </Popover>
              <div className="flex gap-4">
                <div className="w-1/2">
                   <Label htmlFor="hora-inicio">Hora de inicio</Label>
                    <input type="time" id="hora-inicio" className="w-full bg-input border border-border rounded-md p-3 mt-2 text-sm h-12" defaultValue="19:00" />
                </div>
                 <div className="w-1/2">
                   <Label htmlFor="hora-fin">Hora de finalización</Label>
                    <input type="time" id="hora-fin" className="w-full bg-input border border-border rounded-md p-3 mt-2 text-sm h-12" defaultValue="02:00" />
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
            </CardContent>
            <CardFooter className="flex-col gap-4 items-start">
              <div className="w-full flex justify-between font-bold text-2xl text-primary">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button size="lg" className="w-full group">
                Continuar con Reserva
              </Button>
               <p className="text-xs text-muted-foreground pt-2">El siguiente paso es iniciar sesión o registrarte para guardar tu cotización y proceder con la reserva.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
