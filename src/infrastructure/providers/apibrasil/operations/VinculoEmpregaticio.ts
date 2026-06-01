/**
 * @fileoverview Operation VinculoEmpregaticio — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/VinculoEmpregaticio
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { VinculoEmpregaticioSchema } from '../dtos/VinculoEmpregaticioDto.js';
import type { VinculoEmpregaticioDto } from '../dtos/VinculoEmpregaticioDto.js';
import type { IVinculoEmpregaticio } from '../ports/IVinculoEmpregaticio.js';

export class VinculoEmpregaticio implements IVinculoEmpregaticio {
  readonly path = '/vinculo-empregaticio';
  readonly creditValue = 2.5;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, VinculoEmpregaticioDto>> {
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

    return parseOrSchemaError(VinculoEmpregaticioSchema, result.value, 'apibrasil');
  }
}
