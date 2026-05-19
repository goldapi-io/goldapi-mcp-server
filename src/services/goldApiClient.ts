import type { CurrencyCode, GoldApiPriceResponse, MetalPriceResult, MetalSymbol } from '../types/api.js';

export interface GoldApiClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  retries?: number;
}

export class GoldApiError extends Error {
  public readonly status: number | undefined;

  public constructor(message: string, status?: number) {
    super(message);
    this.name = 'GoldApiError';
    this.status = status;
  }
}

export class GoldApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;

  public constructor(options: GoldApiClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? 'https://www.goldapi.io';
    this.timeoutMs = options.timeoutMs ?? 10000;
    this.retries = options.retries ?? 2;
  }

  public async getMetalPrice(metal: MetalSymbol, currency: CurrencyCode): Promise<MetalPriceResult> {
    const response = await this.requestPrice(`/api/${metal}/${currency}`);
    return normalizePriceResponse(response, metal, currency);
  }

  public async getHistoricalMetalPrice(metal: MetalSymbol, currency: CurrencyCode, date: string): Promise<MetalPriceResult> {
    const response = await this.requestPrice(`/api/${metal}/${currency}/${date}`);
    return normalizePriceResponse(response, metal, currency);
  }

  private async requestPrice(path: string): Promise<GoldApiPriceResponse> {
    const url = `${this.baseUrl}${path}`;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-access-token': this.apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.status === 429) {
          if (attempt < this.retries) {
            await delay(backoffMs(attempt, response.headers.get('retry-after')));
            continue;
          }

          throw new GoldApiError('GoldAPI rate limit exceeded. Try again later.', response.status);
        }

        if (response.status >= 500 && attempt < this.retries) {
          await delay(backoffMs(attempt));
          continue;
        }

        if (!response.ok) {
          throw new GoldApiError(`GoldAPI request failed with HTTP ${response.status}.`, response.status);
        }

        return await parseJsonSafely(response);
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;

        if (attempt < this.retries && isRetryableError(error)) {
          await delay(backoffMs(attempt));
          continue;
        }

        break;
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new GoldApiError('GoldAPI request failed.');
  }
}

export function extractPrice(response: GoldApiPriceResponse): number {
  const fields: Array<keyof GoldApiPriceResponse> = ['price', 'ask', 'bid', 'open_price'];

  for (const field of fields) {
    const value = response[field];
    const numericValue = typeof value === 'number' ? value : Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }

  throw new GoldApiError('GoldAPI response did not contain a numeric price field.');
}

function normalizePriceResponse(response: GoldApiPriceResponse, metal: MetalSymbol, currency: CurrencyCode): MetalPriceResult {
  return {
    metal,
    currency,
    price: extractPrice(response),
    change: numberOrNull(response.ch),
    changePercent: numberOrNull(response.chp),
    timestamp: parseTimestamp(response.timestamp),
  };
}

async function parseJsonSafely(response: Response): Promise<GoldApiPriceResponse> {
  try {
    const value = (await response.json()) as unknown;

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new GoldApiError('GoldAPI response was not a JSON object.');
    }

    return value as GoldApiPriceResponse;
  } catch (error) {
    if (error instanceof GoldApiError) {
      throw error;
    }

    throw new GoldApiError('GoldAPI response could not be parsed as JSON.');
  }
}

function numberOrNull(value: unknown): number | null {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function parseTimestamp(value: unknown): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : Math.floor(Date.now() / 1000);
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof GoldApiError) {
    return error.status === 429 || (error.status !== undefined && error.status >= 500);
  }

  return error instanceof Error && error.name === 'AbortError';
}

function backoffMs(attempt: number, retryAfterHeader?: string | null): number {
  const retryAfterSeconds = Number(retryAfterHeader);

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return Math.min(500 * 2 ** attempt, 3000);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
