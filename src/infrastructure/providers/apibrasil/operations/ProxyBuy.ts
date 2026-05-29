/**
 * @fileoverview Operation ProxyBuy — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ProxyBuy
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ProxyBuySchema } from '../dtos/ProxyBuyDto.js';
import type { ProxyBuyDto } from '../dtos/ProxyBuyDto.js';
import type { IProxyBuy } from '../ports/IProxyBuy.js';

export class ProxyBuy implements IProxyBuy {
  readonly path = '/proxy-buy';
  readonly creditValue = 14.98;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProxyBuyDto>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      body: cleanParams,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(ProxyBuySchema, result.value, 'apibrasil');
  }
}
