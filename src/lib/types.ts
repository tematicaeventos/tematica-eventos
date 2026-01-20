import type { User as FirebaseUser } from 'firebase/auth';

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

export type UserProfile = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  fechaRegistro: string;
  estado: 'activo' | 'inactivo';
};

export type QuoteItem = {
    categoria: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export type Quote = {
    cotizacionId: string;
    usuarioId: string;
    nombreCliente: string;
    correo: string;
    telefono: string;
    fechaCotizacion: string;
    items: QuoteItem[];
    total: number;
    estado: 'pendiente' | 'enviado' | 'contactado' | 'en negociación' | 'cerrado' | 'descartado';
    origen: string;
}

export type UserContextType = {
    user: FirebaseUser | null | undefined;
    profile: UserProfile | null | undefined;
}
