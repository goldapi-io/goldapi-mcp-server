#!/usr/bin/env node
import 'dotenv/config';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { GoldApiClient } from './services/goldApiClient.js';
import { createGoldApiMcpServer } from './server.js';
import { calculateMetalValueFromSpotPrice } from './tools/calculateMetalValue.js';
import { SUPPORTED_CURRENCIES, SUPPORTED_METALS } from './utils/validation.js';

async function main(): Promise<void> {
  if (process.argv.includes('--verify')) {
    runVerification();
    return;
  }

  const apiKey = process.env.GOLDAPI_KEY;

  if (!apiKey) {
    console.error('Missing GOLDAPI_KEY environment variable');
    process.exit(1);
  }

  const client = new GoldApiClient({ apiKey });
  const server = createGoldApiMcpServer(client);
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

function runVerification(): void {
  const registeredTools = [
    'get_metal_price',
    'get_historical_metal_price',
    'calculate_metal_value',
    'get_supported_metals',
    'get_supported_currencies',
  ];
  const sampleCalculation = calculateMetalValueFromSpotPrice({
    metal: 'XAU',
    currency: 'AED',
    weight: 125,
    unit: 'gram',
    purity: '22k',
    spotPricePerTroyOunce: 8807.43,
    timestamp: 1716000000,
  });

  console.log(
    JSON.stringify(
      {
        registeredTools,
        supportedMetals: [...SUPPORTED_METALS],
        supportedCurrenciesCount: SUPPORTED_CURRENCIES.length,
        sampleCalculation,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unexpected GoldAPI MCP server error';
  console.error(message);
  process.exit(1);
});
