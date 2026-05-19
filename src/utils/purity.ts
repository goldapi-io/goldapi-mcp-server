import type { Purity } from '../types/api.js';

export const PURITY_PERCENT: Record<Purity, number> = {
  '24k': 100,
  '22k': 91.67,
  '21k': 87.5,
  '20k': 83.33,
  '18k': 75,
  '16k': 66.67,
  '14k': 58.33,
  '10k': 41.67,
};

export function getPurityPercent(purity: Purity): number {
  return PURITY_PERCENT[purity];
}

export function getPurityRatio(purity: Purity): number {
  return getPurityPercent(purity) / 100;
}
