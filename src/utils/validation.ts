import { z } from 'zod';
import type { CurrencyCode, MetalSymbol, Purity, WeightUnit } from '../types/api.js';

export const SUPPORTED_METALS = ['XAU', 'XAG', 'XPT', 'XPD'] as const;

export const METAL_NAMES: Record<MetalSymbol, string> = {
  XAU: 'Gold',
  XAG: 'Silver',
  XPT: 'Platinum',
  XPD: 'Palladium',
};

export const SUPPORTED_CURRENCIES = [
  'AED',
  'AUD',
  'BTC',
  'CAD',
  'CHF',
  'CNY',
  'CZK',
  'EGP',
  'EUR',
  'GBP',
  'HKD',
  'INR',
  'JOD',
  'JPY',
  'KRW',
  'KWD',
  'MXN',
  'MYR',
  'OMR',
  'PLN',
  'RUB',
  'SAR',
  'SGD',
  'THB',
  'USD',
  'ZAR',
] as const;

export const SUPPORTED_UNITS = ['gram', 'kg', 'oz', 'troy_oz'] as const;
export const SUPPORTED_PURITIES = ['24k', '22k', '21k', '20k', '18k', '16k', '14k', '10k'] as const;

export const metalSchema = z.enum(SUPPORTED_METALS);
export const currencySchema = z.enum(SUPPORTED_CURRENCIES);
export const unitSchema = z.enum(SUPPORTED_UNITS);
export const puritySchema = z.enum(SUPPORTED_PURITIES);
export const weightSchema = z.number().positive().finite();
export const dateSchema = z.string().regex(/^\d{8}$/, 'date must use YYYYMMDD format');

export function normalizeMetal(value: string): MetalSymbol {
  return metalSchema.parse(value.trim().toUpperCase());
}

export function normalizeCurrency(value: string): CurrencyCode {
  return currencySchema.parse(value.trim().toUpperCase());
}

export function normalizeUnit(value: string): WeightUnit {
  return unitSchema.parse(value.trim().toLowerCase());
}

export function normalizePurity(value: string): Purity {
  return puritySchema.parse(value.trim().toLowerCase());
}

export function validateDate(value: string): string {
  return dateSchema.parse(value.trim());
}
