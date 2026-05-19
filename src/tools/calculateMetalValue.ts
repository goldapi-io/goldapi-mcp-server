import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GoldApiClient } from '../services/goldApiClient.js';
import type { CalculatedMetalValue, CurrencyCode, MetalSymbol, Purity, WeightUnit } from '../types/api.js';
import { getPurityPercent, getPurityRatio } from '../utils/purity.js';
import { roundMoney, roundPrice, toGrams, TROY_OUNCE_GRAMS, unitLabel } from '../utils/unitConversion.js';
import { currencySchema, METAL_NAMES, metalSchema, puritySchema, unitSchema, weightSchema } from '../utils/validation.js';

const inputSchema = {
  metal: metalSchema.default('XAU'),
  currency: currencySchema.default('USD'),
  weight: weightSchema,
  unit: unitSchema.default('gram'),
  purity: puritySchema.default('24k'),
};

const outputSchema = {
  metal: metalSchema,
  metalName: z.string(),
  currency: currencySchema,
  weight: z.number(),
  unit: unitSchema,
  purity: puritySchema,
  purityPercent: z.number(),
  spotPricePerGram: z.number(),
  adjustedPricePerGram: z.number(),
  totalValue: z.number(),
  timestamp: z.number(),
  humanReadable: z.string(),
};

export function registerCalculateMetalValueTool(server: McpServer, client: GoldApiClient): void {
  server.registerTool(
    'calculate_metal_value',
    {
      title: 'Calculate Metal Value',
      description: 'Calculate value of metal using weight and purity.',
      inputSchema,
      outputSchema,
    },
    async ({ metal, currency, weight, unit, purity }) => {
      const price = await client.getMetalPrice(metal, currency);
      const result = calculateMetalValueFromSpotPrice({
        metal,
        currency,
        weight,
        unit,
        purity,
        spotPricePerTroyOunce: price.price,
        timestamp: price.timestamp,
      });

      return {
        structuredContent: { ...result },
        content: [
          {
            type: 'text',
            text: result.humanReadable,
          },
        ],
      };
    },
  );
}

export function calculateMetalValueFromSpotPrice(input: {
  metal: MetalSymbol;
  currency: CurrencyCode;
  weight: number;
  unit: WeightUnit;
  purity: Purity;
  spotPricePerTroyOunce: number;
  timestamp: number;
}): CalculatedMetalValue {
  const weightInGrams = toGrams(input.weight, input.unit);
  const spotPricePerGram = input.spotPricePerTroyOunce / TROY_OUNCE_GRAMS;
  const adjustedPricePerGram = spotPricePerGram * getPurityRatio(input.purity);
  const totalValue = adjustedPricePerGram * weightInGrams;
  const metalName = METAL_NAMES[input.metal];
  const roundedTotalValue = roundMoney(totalValue);

  return {
    metal: input.metal,
    metalName,
    currency: input.currency,
    weight: input.weight,
    unit: input.unit,
    purity: input.purity,
    purityPercent: getPurityPercent(input.purity),
    spotPricePerGram: roundPrice(spotPricePerGram),
    adjustedPricePerGram: roundPrice(adjustedPricePerGram),
    totalValue: roundedTotalValue,
    timestamp: input.timestamp,
    humanReadable: `The current estimated value of ${formatNumber(input.weight)} ${unitLabel(input.unit, input.weight)} of ${input.purity} ${metalName.toLowerCase()} is ${input.currency} ${formatCurrency(roundedTotalValue)}.`,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
  }).format(value);
}
