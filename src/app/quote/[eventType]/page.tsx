'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { eventTypes } from '@/lib/data';
import { 
    PLANES_BASE, 
    COMIDA_OPTIONS, 
    BEBIDAS_OPTIONS, 
    LICORES_OPTIONS, 
    EXTRAS_OPTIONS 
} from '@/lib/packaged-quote-data';

import {
  Users,
  UtensilsCrossed,
  GlassWater,
  PlusCircle,
  CalendarIcon,
  Clock,
  ShoppingCart,
  PartyPopper
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type SelectedExtras = { [key: string]: boolean };

export default function PackagedQuotePage({ params }: { params: { eventType: string } }) {
  const eventType = useMemo(() => eventTypes.find(e => e.id === params.eventType), [params.eventType]);

  const [personas, setPersonas] = useState<number>(50);
  const [comida, setComida] = useState<string>('2-carnes');
  const [extras, setExtras] = useState<SelectedExtras>({});
  const [fecha, setFecha] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const planBase = useMemo(() => PLANES_BASE.find(p => p.personas === personas) || PLANES_BASE[0], [personas]);
  const comidaSeleccionada = useMemo(() => COMIDA_OPTIONS.find(c => c.id === comida) || COMIDA_OPTIONS[0], [comida]);
  const bebidasNoAlcoholicas = useMemo(() => BEBIDAS_OPTIONS, []);
  const licor = useMemo(() => LICORES_OPTIONS[0], []);
  
  const botellasSugeridas = useMemo(() => {
    return licor.botellasSugeridas[personas] || 0;
  }, [personas, licor]);

  const total = useMemo(() => {
    const costoPlanBase = planBase.precio;
    const costoComida = comidaSeleccionada.precioPorPersona * personas;
    const costoBebidas = bebidasNoAlcoholicas.reduce((acc, b) => acc + (b.precioPorPersona * personas), 0);
    const costoLicor = botellasSugeridas * licor.precioPorBotella;
    const costoExtras = EXTRAS_OPTIONS.reduce((acc, extra) => {
      return extras[extra.id] ? acc + extra.precio : acc;
    }, 0);
    
    return costoPlanBase + costoComida + costoBebidas + costoLicor + costoExtras;
  }, [personas, planBase, comidaSeleccionada, bebidasNoAlcoholicas, botellasSugeridas, licor, extras]);


  const handleExtraChange = (id: string) => {
    setExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
          Cotizador para {eventType.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
          Temática Eventos te ofrece una experiencia completa: salón, sonido, luces, comida, bebidas, decoración y extras personalizables. Cotiza rápida y visualmente según tus necesidades.
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
              <RadioGroup value={personas.toString()} onValueChange={(val) => setPersonas(parseInt(val))} className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Base Plan */}
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-3"><PartyPopper className="text-primary"/> Plan Base (Incluido)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Incluye salón, sonido profesional y luces para <span className="font-bold text-foreground">{personas} personas</span>.</p>
                <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(planBase.precio)}</p>
              </CardContent>
          </Card>


          {/* Food and Drinks */}
          <Accordion type="multiple" defaultValue={['comida', 'bebidas', 'extras']} className="w-full">
            <AccordionItem value="comida">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-3 text-primary"><UtensilsCrossed/> Comida</div>
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={comida} onValueChange={setComida} className="space-y-2 pt-2">
                  {COMIDA_OPTIONS.map(opt => (
                     <Label key={opt.id} htmlFor={opt.id} className="flex justify-between items-center cursor-pointer rounded-lg border p-4 [&:has([data-state=checked])]:border-primary">
                        <div>
                          <p className="font-semibold">{opt.nombre}</p>
                          <p className="text-sm text-muted-foreground">{opt.descripcion}</p>
                          <p className="text-sm font-bold text-primary mt-1">{formatCurrency(opt.precioPorPersona)} / persona</p>
                        </div>
                        <RadioGroupItem value={opt.id} id={opt.id} />
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bebidas">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-3 text-primary"><GlassWater/> Bebidas</div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Bebidas no alcohólicas (Incluidas)</h4>
                    {bebidasNoAlcoholicas.map(bebida => (
                      <div key={bebida.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                        <span>{bebida.nombre}</span>
                        <span className="font-medium">{formatCurrency(bebida.precioPorPersona)} / persona</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Licores (Opcional)</h4>
                     <div className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                        <div>
                          <p>{licor.nombre}</p>
                          <p className="text-xs text-muted-foreground">Sugerido para {personas} personas: <span className="font-bold text-primary">{botellasSugeridas} botellas</span></p>
                        </div>
                        <span className="font-medium">{formatCurrency(licor.precioPorBotella)} / botella</span>
                      </div>
                  </div>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="extras">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-3 text-primary"><PlusCircle/> Extras Adicionales</div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-2">
                 {EXTRAS_OPTIONS.map(extra => (
                    <Label key={extra.id} htmlFor={extra.id} className="flex justify-between items-center cursor-pointer rounded-lg border p-4 [&:has([data-state=checked])]:border-primary">
                        <div>
                           <p className="font-semibold">{extra.nombre}</p>
                           <p className="text-sm text-muted-foreground">{extra.descripcion}</p>
                           <p className="text-sm font-bold text-primary mt-1">{formatCurrency(extra.precio)}</p>
                        </div>
                        <Checkbox id={extra.id} checked={extras[extra.id]} onCheckedChange={() => handleExtraChange(extra.id)} />
                    </Label>
                 ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
                Resumen de tu Cotización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Plan Base ({personas} personas)</p>
                <p className="font-semibold">{formatCurrency(planBase.precio)}</p>
              </div>
               <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Comida: {comidaSeleccionada.nombre}</p>
                <p className="font-semibold">{formatCurrency(comidaSeleccionada.precioPorPersona * personas)}</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Bebidas no alcohólicas</p>
                <p className="font-semibold">{formatCurrency(bebidasNoAlcoholicas.reduce((acc, b) => acc + (b.precioPorPersona * personas), 0))}</p>
              </div>
               <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Whisky ({botellasSugeridas} botellas)</p>
                <p className="font-semibold">{formatCurrency(botellasSugeridas * licor.precioPorBotella)}</p>
              </div>
              <Separator className="my-2" />
               {Object.keys(extras).filter(k => extras[k]).length > 0 && (
                 <>
                    {EXTRAS_OPTIONS.filter(e => extras[e.id]).map(extra => (
                        <div key={extra.id} className="flex justify-between items-center text-sm">
                            <p className="font-medium">{extra.nombre}</p>
                            <p className="font-semibold">{formatCurrency(extra.precio)}</p>
                        </div>
                    ))}
                    <Separator className="my-2" />
                 </>
               )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <div className="w-full flex justify-between font-bold text-xl">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button size="lg" className="w-full group">
                Continuar con Reserva
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
