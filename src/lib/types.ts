import type { User as FirebaseUser } from 'firebase/auth';

// Main page event types
export type EventTypeInfo = {
  id: string;
  title: string;
  description: string;
  image: string;
};

// --- Quote Builder Data ---
export type BasePlan = {
  personas: number;
  precio: number;
};

export type FoodOption = {
  id: string;
  nombre: string;
  precioPorPersona: number;
};

export type DrinkOption = {
  id: string;
  nombre: string;
  precioPorPersona: number;
};

export type LiquorOption = {
  id: string;
  nombre: string;
  precioPorBotella: number;
  botellasSugeridas: number[];
};

export type ExtraOption = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
};

// --- User and Quote ---
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
    // New fields from the quote builder
    tipoEvento: string;
    personas: number;
    fechaEvento: string;
    horaInicio: string;
    horaFin: string;
}

export type UserContextType = {
    user: FirebaseUser | null | undefined;
    profile: UserProfile | null | undefined;
}
