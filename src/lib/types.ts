export type EventTypeInfo = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const VendorServices = ['Venue', 'Catering', 'Music', 'Photography'] as const;
export type VendorService = (typeof VendorServices)[number];
