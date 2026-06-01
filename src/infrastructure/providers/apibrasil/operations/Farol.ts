/**
 * @fileoverview Operation Farol — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Farol
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { FarolSchema } from '../dtos/FarolDto.js';
import type { FarolDto } from '../dtos/FarolDto.js';
import type { IFarol } from '../ports/IFarol.js';

export class Farol implements IFarol {
  readonly path = '/vehicles/dados';
  readonly creditValue = 11.0;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, FarolDto>> {
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

    return parseOrSchemaError(FarolSchema, result.value, 'apibrasil');
  }
}
