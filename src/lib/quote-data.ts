import type { BasePlan, FoodOption, DrinkOption, LiquorOption, ExtraOption } from './types';

export const basePlans: BasePlan[] = [
    { personas: 50, precio: 3000000 },
    { personas: 75, precio: 3800000 },
    { personas: 100, precio: 4500000 },
    { personas: 200, precio: 6800000 },
];

export const foodOptions: FoodOption[] = [
    { id: '2-carnes', nombre: 'Opción A – 2 Carnes', precioPorPersona: 45000 },
    { id: '3-carnes', nombre: 'Opción B – 3 Carnes', precioPorPersona: 60000 },
];

export const nonAlcoholicDrinks: DrinkOption[] = [
    { id: 'gaseosa', nombre: 'Gaseosa ilimitada', precioPorPersona: 7000 },
    { id: 'agua', nombre: 'Agua', precioPorPersona: 3000 },
]

export const liquorOptions: LiquorOption[] = [
    { 
        id: 'whisky', 
        nombre: 'Whisky (700ml)', 
        precioPorBotella: 120000, 
        botellasSugeridas: [3, 5, 7, 12] // For 50, 75, 100, 200 people
    },
]

export const extraOptions: ExtraOption[] = [
    { id: 'manteleria', nombre: 'Mantelería premium', descripcion: 'Viste tus mesas con elegancia.', precio: 600000 },
    { id: 'decoracion', nombre: 'Decoración temática', descripcion: 'Ambiente personalizado para tu evento.', precio: 1800000 },
    { id: 'dj', nombre: 'DJ profesional', descripcion: 'La mejor música para tu fiesta.', precio: 900000 },
    { id: 'fotografia', nombre: 'Fotografía full evento', descripcion: 'Recuerdos imborrables de tu día especial.', precio: 1200000 },
    { id: 'videografia', nombre: 'Videografía full evento', descripcion: 'Un video profesional de tu celebración.', precio: 1200000 },
    { id: 'pastel', nombre: 'Pastel grande', descripcion: 'Un pastel temático y delicioso.', precio: 800000 },
    { id: 'sillas-premium', nombre: 'Mesas y sillas premium', descripcion: 'Mobiliario de lujo para tus invitados.', precio: 650000 },
    { id: 'transporte', nombre: 'Transporte para invitados', descripcion: 'Comodidad para que todos lleguen a tiempo.', precio: 400000 },
];
