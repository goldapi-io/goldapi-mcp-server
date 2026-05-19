import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { SUPPORTED_METALS } from '../utils/validation.js';

const outputSchema = {
  metals: z.array(z.enum(SUPPORTED_METALS)),
};

export function registerGetSupportedMetalsTool(server: McpServer): void {
  server.registerTool(
    'get_supported_metals',
    {
      title: 'Get Supported Metals',
      description: 'Return supported GoldAPI metal symbols.',
      outputSchema,
    },
    async () => {
      const result = { metals: [...SUPPORTED_METALS] };

      return {
        structuredContent: result,
        content: [
          {
            type: 'text',
            text: result.metals.join(', '),
          },
        ],
      };
    },
  );
}
