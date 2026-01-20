'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  basePlans,
  foodOptions,
  nonAlcoholicDrinks,
  liquorOptions,
  extraOptions,
} from '@/lib/quote-data';
import type {
  BasePlan,
  FoodOption,
  ExtraOption,
  Quote,
  QuoteItem as QuoteItemType,
} from '@/lib/types';
import {
  Users,
  Utensils,
  GlassWater,
  PartyPopper,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
} from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { eventTypes } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { saveQuote } from '@/firebase/firestore';

const peopleOptions = [50, 75, 100, 200];
const defaultPersonCount = 50;

export default function QuotesPage() {
  const { user, profile } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const eventTypeId = searchParams.get('event');
  const eventType = useMemo(
    () => (eventTypeId ? eventTypes.find((e) => e.id === eventTypeId) : null),
    [eventTypeId]
  );

  const [personCount, setPersonCount] = useState<number>(defaultPersonCount);
  const [foodChoice, setFoodChoice] = useState<string>('none');
  const [whiskyBottles, setWhiskyBottles] = useState<number>(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>('19:00');
  const [endTime, setEndTime] = useState<string>('03:00');
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);
  
  useEffect(() => {
    const suggestedBottles =
      liquorOptions[0]?.botellasSugeridas[
        peopleOptions.indexOf(personCount)
      ] || 0;
    setWhiskyBottles(suggestedBottles);
  }, [personCount]);


  const basePlan = useMemo(
    () => basePlans.find((p) => p.personas === personCount)!,
    [personCount]
  );
  const selectedFood = useMemo(
    () => foodOptions.find((f) => f.id === foodChoice),
    [foodChoice]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const quoteItems = useMemo(() => {
    const items: QuoteItemType[] = [];

    // Base Plan
    items.push({
      nombre: `Plan Base: Salón, Luces y Sonido (${basePlan.personas} personas)`,
      cantidad: 1,
      precioUnitario: basePlan.precio,
      subtotal: basePlan.precio,
      categoria: 'Plan Base'
    });

    // Food
    if (selectedFood) {
      items.push({
        nombre: `Comida: ${selectedFood.nombre}`,
        cantidad: personCount,
        precioUnitario: selectedFood.precioPorPersona,
        subtotal: selectedFood.precioPorPersona * personCount,
        categoria: 'Comida'
      });
    }

    // Non-alcoholic drinks
    nonAlcoholicDrinks.forEach(drink => {
        items.push({
            nombre: `Bebidas: ${drink.nombre}`,
            cantidad: personCount,
            precioUnitario: drink.precioPorPersona,
            subtotal: drink.precioPorPersona * personCount,
            categoria: 'Bebidas'
        });
    });

    // Liquor
    if (whiskyBottles > 0) {
        const whisky = liquorOptions[0]!;
        items.push({
            nombre: `Licor: ${whisky.nombre}`,
            cantidad: whiskyBottles,
            precioUnitario: whisky.precioPorBotella,
            subtotal: whisky.precioPorBotella * whiskyBottles,
            categoria: 'Licor'
        });
    }

    // Extras
    extraOptions.filter(e => selectedExtras.includes(e.id)).forEach(extra => {
        items.push({
            nombre: `Extra: ${extra.nombre}`,
            cantidad: 1,
            precioUnitario: extra.precio,
            subtotal: extra.precio,
            categoria: 'Extras'
        });
    });

    return items;
  }, [personCount, basePlan, selectedFood, whiskyBottles, selectedExtras]);

  const total = useMemo(() => quoteItems.reduce((acc, item) => acc + item.subtotal, 0), [quoteItems]);

  const handleSaveQuote = async () => {
    if (!user || !profile || !eventDate) {
        toast({ variant: 'destructive', title: 'Faltan datos', description: 'Por favor, selecciona una fecha para el evento e inicia sesión.' });
        return;
    }
    setIsSaving(true);
    const quoteData: Omit<Quote, 'cotizacionId' | 'fechaCotizacion'> = {
        usuarioId: user.uid,
        nombreCliente: profile.nombre,
        correo: profile.correo,
        telefono: profile.telefono,
        items: quoteItems,
        total,
        estado: 'pendiente',
        origen: 'web-wizard',
        tipoEvento: eventType?.title || 'No especificado',
        personas: personCount,
        fechaEvento: format(eventDate, 'yyyy-MM-dd'),
        horaInicio: startTime,
        horaFin: endTime,
    };

    try {
        const newQuoteId = await saveQuote(quoteData);
        setQuoteId(newQuoteId);
        toast({ title: 'Cotización Guardada', description: `Tu cotización #${newQuoteId} ha sido guardada.` });
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la cotización.' });
    } finally {
        setIsSaving(false);
    }
  }


  if (user === undefined || (user && profile === undefined)) {
    return <div className="container py-8 text-center">Cargando...</div>;
  }

  const renderSection = (icon: React.ReactNode, title: string, children: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          {eventType ? `Cotizador para ${eventType.title}` : 'Arma tu Evento a Medida'}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {eventType
            ? eventType.description
            : 'Selecciona los servicios que necesitas. El valor se calcula automáticamente.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* People */}
          {renderSection(
            <Users className="text-primary" />,
            '1. Número de Personas',
            <RadioGroup
              value={String(personCount)}
              onValueChange={(val) => setPersonCount(Number(val))}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {peopleOptions.map((p) => (
                <div key={p}>
                  <RadioGroupItem value={String(p)} id={`p-${p}`} className="peer sr-only" />
                  <Label
                    htmlFor={`p-${p}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Users className="mb-3 h-6 w-6" />
                    {p} personas
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Base Plan */}
          <Card className="bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">Plan Base (Incluido)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className='text-muted-foreground'>Incluye Salón, Luces y Sonido para {personCount} personas.</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(basePlan.precio)}</p>
            </CardContent>
          </Card>


          {/* Food */}
          {renderSection(
            <Utensils className="text-primary" />,
            '2. Comida',
            <RadioGroup
              value={foodChoice}
              onValueChange={setFoodChoice}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="food-none" />
                <Label htmlFor="food-none" className="font-normal cursor-pointer">No incluir comida</Label>
              </div>
              {foodOptions.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.id} id={opt.id} />
                  <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                    {opt.nombre} ({formatCurrency(opt.precioPorPersona)} / persona)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Drinks */}
          {renderSection(
            <GlassWater className="text-primary" />,
            '3. Bebidas y Licor',
            <div className='space-y-4'>
                <div>
                    <h4 className='font-semibold mb-2'>Bebidas no alcohólicas (Incluidas)</h4>
                    <ul className='list-disc list-inside text-muted-foreground'>
                        {nonAlcoholicDrinks.map(d => <li key={d.id}>{d.nombre} ({formatCurrency(d.precioPorPersona)} / persona)</li>)}
                    </ul>
                </div>
                <Separator />
                <div>
                    <h4 className='font-semibold mb-2'>Licor (Opcional)</h4>
                    <div className='flex items-center justify-between'>
                       <Label htmlFor='whisky'>{liquorOptions[0]?.nombre} ({formatCurrency(liquorOptions[0]?.precioPorBotella || 0)} / botella)</Label>
                       <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWhiskyBottles(Math.max(0, whiskyBottles - 1))}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input id="whisky" type="number" className="w-16 h-8 text-center" value={whiskyBottles} onChange={e => setWhiskyBottles(Number(e.target.value))} min="0" />
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWhiskyBottles(whiskyBottles + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                     <p className='text-xs text-muted-foreground mt-2'>Sugerido para {personCount} personas: {liquorOptions[0]?.botellasSugeridas[peopleOptions.indexOf(personCount)] || 0} botellas</p>
                </div>
            </div>
          )}
          
          {/* Extras */}
          {renderSection(<PartyPopper className="text-primary" />, '4. Extras Adicionales', 
            <div className='space-y-3'>
                {extraOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-3">
                        <Checkbox id={opt.id} checked={selectedExtras.includes(opt.id)} onCheckedChange={checked => {
                            setSelectedExtras(prev => checked ? [...prev, opt.id] : prev.filter(id => id !== opt.id))
                        }} />
                        <div className='grid gap-1.5 leading-none'>
                            <Label htmlFor={opt.id} className="font-normal cursor-pointer">{opt.nombre}</Label>
                            <p className='text-xs text-muted-foreground'>{opt.descripcion}</p>
                        </div>
                        <p className='ml-auto font-medium'>{formatCurrency(opt.precio)}</p>
                    </div>
                ))}
            </div>
          )}

          {/* Agenda */}
          {renderSection(
            <CalendarIcon className="text-primary" />,
            '5. Agenda',
            <div className="grid md:grid-cols-3 gap-4">
              <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !eventDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, 'PPP', { locale: es }) : <span>Elige una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={(date) => {
                      setEventDate(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="pl-9" />
              </div>
              <div className="relative">
                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="pl-9" />
              </div>
            </div>
          )}

        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <ShoppingCart className="text-primary"/>
                        Resumen de Cotización
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {quoteItems.length > 0 ? (
                        <>
                            {quoteItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start text-sm">
                                    <div className='flex-1 pr-2'>
                                        <p className="font-medium">{item.nombre}</p>
                                        {item.cantidad > 1 && <p className='text-muted-foreground'>{item.cantidad} x {formatCurrency(item.precioUnitario)}</p>}
                                    </div>
                                    <p className="font-semibold text-right">{formatCurrency(item.subtotal)}</p>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            Tu cotización está vacía.
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveQuote} size="lg" className="w-full group" disabled={isSaving || !eventDate}>
                       {isSaving ? "Guardando..." : "Guardar Cotización"}
                       {!isSaving && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                    </Button>
                </CardFooter>
                 {quoteId && (
                     <CardFooter className='flex-col items-start gap-2 pt-4'>
                         <p className='text-sm text-center w-full'>¡Cotización guardada! Código: <span className='font-bold text-primary'>{quoteId}</span></p>
                         <Button variant="outline" className='w-full' onClick={() => alert('Función de pago no implementada aún.')}>Proceder al Pago (30%)</Button>
                     </CardFooter>
                 )}
            </Card>
        </div>
      </div>
    </div>
  );
}
