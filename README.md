# GoldAPI.io MCP Server

Official Model Context Protocol server for GoldAPI.io precious metals data.

`@goldapi/mcp-server` lets MCP clients such as Claude Desktop, ChatGPT, Cursor, Windsurf, and other AI agent runtimes retrieve real-time and historical precious metals prices from GoldAPI and perform common bullion and jewelry value calculations.

## Features

- Latest GoldAPI.io spot prices for gold, silver, platinum, and palladium.
- Historical GoldAPI prices by date.
- Metal value calculations by weight, unit, and purity.
- Supported currencies for major fiat currencies and BTC.
- Strict input validation with useful MCP errors.

## Installation

```bash
npm install -g @goldapi/mcp-server
```

You can also run without global installation:

```bash
npx -y @goldapi/mcp-server
```

## Environment

Create a GoldAPI API key from the GoldAPI dashboard and pass it as `GOLDAPI_KEY`.

```bash
GOLDAPI_KEY=your_api_key
```

If `GOLDAPI_KEY` is missing, the server exits with:

```text
Missing GOLDAPI_KEY environment variable
```

## Claude Desktop Configuration

Add this to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "goldapi": {
      "command": "npx",
      "args": ["-y", "@goldapi/mcp-server"],
      "env": {
        "GOLDAPI_KEY": "your_api_key"
      }
    }
  }
}
```

## Cursor Setup

Add a new MCP server in Cursor settings:

```json
{
  "mcpServers": {
    "goldapi": {
      "command": "npx",
      "args": ["-y", "@goldapi/mcp-server"],
      "env": {
        "GOLDAPI_KEY": "your_api_key"
      }
    }
  }
}
```

## Windsurf Setup

Add the server to your Windsurf MCP configuration:

```json
{
  "mcpServers": {
    "goldapi": {
      "command": "npx",
      "args": ["-y", "@goldapi/mcp-server"],
      "env": {
        "GOLDAPI_KEY": "your_api_key"
      }
    }
  }
}
```

## Tools

### `get_metal_price`

Get latest precious metal spot price.

Input:

```json
{
  "metal": "XAU",
  "currency": "USD"
}
```

Output:

```json
{
  "metal": "XAU",
  "currency": "USD",
  "price": 2391.72,
  "change": 11.6,
  "changePercent": 0.49,
  "timestamp": 1716000000
}
```

### `get_historical_metal_price`

Retrieve historical metal price.

Input:

```json
{
  "metal": "XAU",
  "currency": "USD",
  "date": "20250101"
}
```

Calls:

```text
GET https://www.goldapi.io/api/{metal}/{currency}/{date}
```

### `calculate_metal_value`

Calculate value of metal using weight and purity.

Input:

```json
{
  "metal": "XAU",
  "currency": "AED",
  "weight": 125,
  "unit": "gram",
  "purity": "22k"
}
```

Output:

```json
{
  "metal": "XAU",
  "metalName": "Gold",
  "currency": "AED",
  "weight": 125,
  "unit": "gram",
  "purity": "22k",
  "purityPercent": 91.67,
  "spotPricePerGram": 283.21,
  "adjustedPricePerGram": 259.57,
  "totalValue": 32446.25,
  "timestamp": 1716000000,
  "humanReadable": "The current estimated value of 125 grams of 22k gold is AED 32,446.25."
}
```

Supported units:

- `gram`
- `kg`
- `oz`
- `troy_oz`

Supported purities:

- `24k` = 100%
- `22k` = 91.67%
- `21k` = 87.5%
- `20k` = 83.33%
- `18k` = 75%
- `16k` = 66.67%
- `14k` = 58.33%
- `10k` = 41.67%

### `get_supported_metals`

Returns:

```json
["XAU", "XAG", "XPT", "XPD"]
```

### `get_supported_currencies`

Returns all supported currencies.

## Supported Metals

- `XAU` - Gold
- `XAG` - Silver
- `XPT` - Platinum
- `XPD` - Palladium

## Supported Currencies

```text
AED, AUD, BTC, CAD, CHF, CNY, CZK, EGP, EUR, GBP, HKD, INR, JOD, JPY, KRW, KWD, MXN, MYR, OMR, PLN, RUB, SAR, SGD, THB, USD, ZAR
```

## Example Prompts

```text
What is gold price in AUD?
```

```text
What is current value of 125 grams of 22k gold in AED?
```

```text
What was gold price in USD on January 1st 2025?
```

```text
What is value of 3 troy ounces of silver?
```

## Local Development

```bash
npm install
npm run build
npm run verify
```

Run the server locally:

```bash
GOLDAPI_KEY=your_api_key npm run dev
```

Run the built server:

```bash
GOLDAPI_KEY=your_api_key npm start
```

## Publishing

```bash
npm publish --access public
```
