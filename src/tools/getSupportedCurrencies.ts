import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { SUPPORTED_CURRENCIES } from '../utils/validation.js';

const outputSchema = {
  currencies: z.array(z.enum(SUPPORTED_CURRENCIES)),
};

export function registerGetSupportedCurrenciesTool(server: McpServer): void {
  server.registerTool(
    'get_supported_currencies',
    {
      title: 'Get Supported Currencies',
      description: 'Return supported GoldAPI currency codes.',
      outputSchema,
    },
    async () => {
      const result = { currencies: [...SUPPORTED_CURRENCIES] };

      return {
        structuredContent: result,
        content: [
          {
            type: 'text',
            text: result.currencies.join(', '),
          },
        ],
      };
    },
  );
}
