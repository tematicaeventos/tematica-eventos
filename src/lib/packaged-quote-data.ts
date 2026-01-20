import type { PlanBase, ComidaOption, BebidaOption, LicorOption, ExtraOption } from './types';

export const PLANES_BASE: PlanBase[] = [
    { personas: 50, precio: 3000000 },
    { personas: 75, precio: 3800000 },
    { personas: 100, precio: 4500000 },
    { personas: 200, precio: 6800000 },
];

export const COMIDA_OPTIONS: ComidaOption[] = [
    { id: '2-carnes', nombre: 'Opción A - 2 Carnes', descripcion: 'Menú principal con dos opciones de proteína, plato y acompañamientos.', precioPorPersona: 45000 },
    { id: '3-carnes', nombre: 'Opción B - 3 Carnes', descripcion: 'Menú premium con tres opciones de proteína, plato y acompañamientos.', precioPorPersona: 60000 },
];

export const BEBIDAS_OPTIONS: BebidaOption[] = [
    { id: 'gaseosa', nombre: 'Gaseosa ilimitada', precioPorPersona: 7000 },
    { id: 'agua', nombre: 'Agua', precioPorPersona: 3000 },
];

export const LICORES_OPTIONS: LicorOption[] = [
    { 
        id: 'whisky', 
        nombre: 'Whisky (Botella 700ml)', 
        precioPorBotella: 120000,
        botellasSugeridas: {
            50: 3,
            75: 5,
            100: 7,
            200: 12
        }
    },
];

export const EXTRAS_OPTIONS: ExtraOption[] = [
    { id: 'manteleria-premium', nombre: 'Mantelería Premium', descripcion: 'Manteles y servilletas de lujo para todas las mesas.', precio: 600000 },
    { id: 'decoracion-tematica', nombre: 'Decoración Temática', descripcion: 'Ambiente personalizado según el tema del evento.', precio: 1800000 },
    { id: 'dj-profesional', nombre: 'DJ Profesional', descripcion: 'Música y animación durante todo el evento.', precio: 900000 },
    { id: 'fotografia', nombre: 'Fotografía Full Evento', descripcion: 'Cobertura fotográfica completa del evento.', precio: 1200000 },
    { id: 'videografia', nombre: 'Videografía Full Evento', descripcion: 'Grabación y edición de un video resumen del evento.', precio: 1200000 },
    { id: 'pastel-grande', nombre: 'Pastel Grande', descripcion: 'Pastel temático para 100+ porciones.', precio: 800000 },
    { id: 'mesas-sillas-premium', nombre: 'Mesas y Sillas Premium', descripcion: 'Mobiliario de diseño para un look más elegante.', precio: 650000 },
    { id: 'transporte-invitados', nombre: 'Transporte para Invitados', descripcion: 'Servicio de bus o vans para el traslado de los invitados (ida y vuelta).', precio: 400000 },
];
