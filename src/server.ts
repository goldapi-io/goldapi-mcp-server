import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GoldApiClient } from './services/goldApiClient.js';
import { registerCalculateMetalValueTool } from './tools/calculateMetalValue.js';
import { registerGetHistoricalMetalPriceTool } from './tools/getHistoricalMetalPrice.js';
import { registerGetMetalPriceTool } from './tools/getMetalPrice.js';
import { registerGetSupportedCurrenciesTool } from './tools/getSupportedCurrencies.js';
import { registerGetSupportedMetalsTool } from './tools/getSupportedMetals.js';

export function createGoldApiMcpServer(client: GoldApiClient): McpServer {
  const server = new McpServer({
    name: '@goldapi/mcp-server',
    version: '1.0.0',
  });

  registerGetMetalPriceTool(server, client);
  registerGetHistoricalMetalPriceTool(server, client);
  registerCalculateMetalValueTool(server, client);
  registerGetSupportedMetalsTool(server);
  registerGetSupportedCurrenciesTool(server);

  return server;
}
