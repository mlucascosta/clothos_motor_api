/**
 * @fileoverview Operation VipCar — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/VipCar
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { VipCarSchema } from '../dtos/VipCarDto.js';
import type { VipCarDto } from '../dtos/VipCarDto.js';
import type { IVipCar } from '../ports/IVipCar.js';

export class VipCar implements IVipCar {
  readonly path = '/vip-car';
  readonly creditValue = 29.0;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, VipCarDto>> {
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

    return parseOrSchemaError(VipCarSchema, result.value, 'apibrasil');
  }
}
