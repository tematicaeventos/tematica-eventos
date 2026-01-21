import type { PlanBase, ComidaOption, BebidaOption, LicorOption, ExtraOption } from './types';

// Prices based on the user's table for an all-inclusive "15 años" event package.
// This structure is now used for all packaged quotes.
export const PLANES_BASE: PlanBase[] = [
    { personas: 50, precio: 7110000 },
    { personas: 100, precio: 11020000 },
    { personas: 200, precio: 18790000 },
];

// The items below are now included in the all-inclusive PLANES_BASE.
// They are kept here as empty arrays to avoid breaking imports, but are not used for calculation or display.
export const COMIDA_OPTIONS: ComidaOption[] = [];

export const BEBIDAS_OPTIONS: BebidaOption[] = [];

export const LICORES_OPTIONS: LicorOption[] = [];

export const EXTRAS_OPTIONS: ExtraOption[] = [];
