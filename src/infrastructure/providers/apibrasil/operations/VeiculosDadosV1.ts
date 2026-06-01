/**
 * @fileoverview Operation VeiculosDadosV1 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/VeiculosDadosV1
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { VeiculosDadosV1Schema } from '../dtos/VeiculosDadosV1Dto.js';
import type { VeiculosDadosV1Dto } from '../dtos/VeiculosDadosV1Dto.js';
import type { IVeiculosDadosV1 } from '../ports/IVeiculosDadosV1.js';

export class VeiculosDadosV1 implements IVeiculosDadosV1 {
  readonly path = '/veiculos-dados';
  readonly creditValue = 2.5;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, VeiculosDadosV1Dto>> {
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

    return parseOrSchemaError(VeiculosDadosV1Schema, result.value, 'apibrasil');
  }
}
