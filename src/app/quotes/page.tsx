'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Calculator, Check, PartyPopper } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { VendorServices, type VendorService } from '@/lib/types';

const quoteFormSchema = z.object({
  eventType: z.string().min(1, 'Please select an event type.'),
  guestCount: z.coerce.number().min(1, 'At least one guest is required.'),
  eventDate: z.date({ required_error: 'An event date is required.' }),
  services: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one service.',
  }),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

type QuoteDetails = {
  total: number;
  breakdown: { service: VendorService; cost: number }[];
};

export default function QuotesPage() {
  const [quote, setQuote] = useState<QuoteDetails | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      eventType: '',
      guestCount: 50,
      services: [],
    },
  });

  function onSubmit(data: QuoteFormValues) {
    const serviceCosts = {
      Venue: 500,
      Catering: 40, // per guest
      Music: 300,
      Photography: 600,
    };

    const breakdown = data.services
      .map((service) => {
        const s = service as VendorService;
        let cost = serviceCosts[s];
        if (s === 'Catering') {
          cost *= data.guestCount;
        }
        return { service: s, cost };
      })
      .filter((item): item is { service: VendorService, cost: number } => !!item);

    const total = breakdown.reduce((acc, item) => acc + item.cost, 0);

    setQuote({ total, breakdown });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Instant Event Quote
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Plan your budget in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="fade-in">
            <CardHeader>
                <CardTitle className="flex items-center"><Calculator className="mr-2 h-5 w-5 text-primary"/>Quote Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Required Services</FormLabel>
                      <FormDescription>
                        Select the services you are interested in.
                      </FormDescription>
                    </div>
                    {VendorServices.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Generate Quote
              </Button>
            </form>
          </Form>
            </CardContent>
        </Card>
        
        <div className="fade-in" style={{ animationDelay: '200ms' }}>
          {quote && (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className='flex items-center'>
                    <PartyPopper className="mr-2 h-5 w-5 text-primary"/> Your Estimated Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.breakdown.map((item) => (
                    <div key={item.service} className="flex justify-between">
                      <span className="text-muted-foreground">{item.service}</span>
                      <span>${item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                    <span>Estimated Total</span>
                    <span>${quote.total.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  *This is an estimate. Prices may vary based on specific vendors and availability.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
