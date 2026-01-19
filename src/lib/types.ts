export type EventTypeInfo = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const VendorServices = ['Salón', 'Catering', 'Música', 'Fotografía'] as const;
export type VendorService = (typeof VendorServices)[number];
