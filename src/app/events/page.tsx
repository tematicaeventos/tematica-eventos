'use client';

import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

import { events, eventCategories } from '@/lib/data';
import type { Event, EventCategory } from '@/lib/types';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useMemo(() => {
    let newFilteredEvents = events;

    if (selectedCategory !== 'all') {
      newFilteredEvents = newFilteredEvents.filter(
        (event) => event.category === selectedCategory
      );
    }

    if (selectedDate) {
      newFilteredEvents = newFilteredEvents.filter((event) =>
        isSameDay(new Date(event.date), selectedDate)
      );
    }

    setFilteredEvents(newFilteredEvents);
  }, [selectedCategory, selectedDate]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDate(undefined);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as EventCategory | 'all');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Upcoming Events
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find your next experience. Filter by category or date.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 rounded-lg bg-card border">
        <div className='flex flex-col sm:flex-row gap-4 flex-1'>
            <Select onValueChange={handleCategoryChange} value={selectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <SelectValue placeholder="Filter by category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full sm:w-[240px] justify-start text-left font-normal bg-background',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
        </div>
        {(selectedCategory !== 'all' || selectedDate) && (
            <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
        )}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold text-muted-foreground">
            No events match your filters.
          </p>
          <p className="mt-2 text-muted-foreground">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
