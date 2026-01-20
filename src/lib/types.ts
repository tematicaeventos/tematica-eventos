export type EventTypeInfo = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const VendorServices = ['Salón', 'Alimentos y bebidas', 'Música', 'Fotografía', 'Decoración', 'Pastel'] as const;
export type VendorService = (typeof VendorServices)[number];

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: 'unidad' | 'persona' | 'paquete';
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: ServiceItem[];
};

export type SelectedService = ServiceItem & {
  quantity: number;
};
