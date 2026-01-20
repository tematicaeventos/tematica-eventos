'use client';

import { useState, useMemo } from 'react';
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
import type { SelectedService, ServiceItem } from '@/lib/types';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function BuildEventPage() {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const handleServiceToggle = (service: ServiceItem, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, { ...service, quantity: 1 }]);
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    }
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setSelectedServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, quantity: newQuantity } : s))
      );
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    }
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
  
  const getServiceFromId = (serviceId: string): ServiceItem | undefined => {
    for (const category of serviceCategories) {
      const found = category.items.find(item => item.id === serviceId);
      if (found) return found;
    }
    return undefined;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Arma tu Evento a Medida
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Selecciona los servicios que necesitas. El valor se calcula automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="md:col-span-2">
          <Accordion type="multiple" className="w-full space-y-4">
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
                                <div className="flex items-center gap-2">
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
                    <Button className="w-full group" size="lg">
                        Continuar con la reserva
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
