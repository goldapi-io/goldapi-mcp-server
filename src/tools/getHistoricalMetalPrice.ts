import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GoldApiClient } from '../services/goldApiClient.js';
import { currencySchema, dateSchema, metalSchema } from '../utils/validation.js';

const inputSchema = {
  metal: metalSchema.default('XAU'),
  currency: currencySchema.default('USD'),
  date: dateSchema,
};

const outputSchema = {
  metal: metalSchema,
  currency: currencySchema,
  price: z.number(),
  change: z.number().nullable(),
  changePercent: z.number().nullable(),
  timestamp: z.number(),
};

export function registerGetHistoricalMetalPriceTool(server: McpServer, client: GoldApiClient): void {
  server.registerTool(
    'get_historical_metal_price',
    {
      title: 'Get Historical Metal Price',
      description: 'Retrieve historical metal price.',
      inputSchema,
      outputSchema,
    },
    async ({ metal, currency, date }) => {
      const result = await client.getHistoricalMetalPrice(metal, currency, date);

      return {
        structuredContent: { ...result },
        content: [
          {
            type: 'text',
            text: `${result.metal}/${result.currency} historical price for ${date} is ${result.currency} ${result.price}.`,
          },
        ],
      };
    },
  );
}
