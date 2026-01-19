import type { PlaceHolderImages } from "./placeholder-images";

export type EventCategory = 'Music' | 'Art' | 'Food' | 'Community' | 'Tech';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  location: string;
  organizer: string;
  category: EventCategory;
  image: (typeof PlaceHolderImages)[number]['id'];
};

export const VendorServices = ['Venue', 'Catering', 'Music', 'Photography'] as const;
export type VendorService = (typeof VendorServices)[number];
