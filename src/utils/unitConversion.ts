import type { WeightUnit } from '../types/api.js';

export const TROY_OUNCE_GRAMS = 31.1035;
const AVOIRDUPOIS_OUNCE_GRAMS = 28.349523125;

export function toGrams(weight: number, unit: WeightUnit): number {
  switch (unit) {
    case 'gram':
      return weight;
    case 'kg':
      return weight * 1000;
    case 'oz':
      return weight * AVOIRDUPOIS_OUNCE_GRAMS;
    case 'troy_oz':
      return weight * TROY_OUNCE_GRAMS;
  }
}

export function unitLabel(unit: WeightUnit, weight: number): string {
  switch (unit) {
    case 'gram':
      return weight === 1 ? 'gram' : 'grams';
    case 'kg':
      return weight === 1 ? 'kilogram' : 'kilograms';
    case 'oz':
      return weight === 1 ? 'ounce' : 'ounces';
    case 'troy_oz':
      return weight === 1 ? 'troy ounce' : 'troy ounces';
  }
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundPrice(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
