import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GoldApiClient } from '../services/goldApiClient.js';
import { currencySchema, metalSchema } from '../utils/validation.js';

const inputSchema = {
  metal: metalSchema.default('XAU'),
  currency: currencySchema.default('USD'),
};

const outputSchema = {
  metal: metalSchema,
  currency: currencySchema,
  price: z.number(),
  change: z.number().nullable(),
  changePercent: z.number().nullable(),
  timestamp: z.number(),
};

export function registerGetMetalPriceTool(server: McpServer, client: GoldApiClient): void {
  server.registerTool(
    'get_metal_price',
    {
      title: 'Get Metal Price',
      description: 'Get latest precious metal spot price.',
      inputSchema,
      outputSchema,
    },
    async ({ metal, currency }) => {
      const result = await client.getMetalPrice(metal, currency);

      return {
        structuredContent: { ...result },
        content: [
          {
            type: 'text',
            text: `${result.metal}/${result.currency} spot price is ${result.currency} ${result.price}.`,
          },
        ],
      };
    },
  );
}
