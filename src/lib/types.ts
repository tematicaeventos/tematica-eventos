export type EventTypeInfo = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const VendorServices = ['Salón', 'Alimentos y bebidas', 'Música', 'Fotografía', 'Decoración', 'Pastel'] as const;
export type VendorService = (typeof VendorServices)[number];
