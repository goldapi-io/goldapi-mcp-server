export type MetalSymbol = 'XAU' | 'XAG' | 'XPT' | 'XPD';

export type CurrencyCode =
  | 'AED'
  | 'AUD'
  | 'BTC'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'CZK'
  | 'EGP'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'INR'
  | 'JOD'
  | 'JPY'
  | 'KRW'
  | 'KWD'
  | 'MXN'
  | 'MYR'
  | 'OMR'
  | 'PLN'
  | 'RUB'
  | 'SAR'
  | 'SGD'
  | 'THB'
  | 'USD'
  | 'ZAR';

export type WeightUnit = 'gram' | 'kg' | 'oz' | 'troy_oz';

export type Purity = '24k' | '22k' | '21k' | '20k' | '18k' | '16k' | '14k' | '10k';

export interface GoldApiPriceResponse {
  metal?: string;
  currency?: string;
  price?: number | string;
  ask?: number | string;
  bid?: number | string;
  open_price?: number | string;
  ch?: number | string;
  chp?: number | string;
  timestamp?: number | string;
  [key: string]: unknown;
}

export interface MetalPriceResult {
  metal: MetalSymbol;
  currency: CurrencyCode;
  price: number;
  change: number | null;
  changePercent: number | null;
  timestamp: number;
}

export interface CalculatedMetalValue {
  metal: MetalSymbol;
  metalName: string;
  currency: CurrencyCode;
  weight: number;
  unit: WeightUnit;
  purity: Purity;
  purityPercent: number;
  spotPricePerGram: number;
  adjustedPricePerGram: number;
  totalValue: number;
  timestamp: number;
  humanReadable: string;
}
