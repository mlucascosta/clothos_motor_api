/**
 * @fileoverview Operation CpfSociodemograficos — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CpfSociodemograficos
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CpfSociodemograficosSchema } from '../dtos/CpfSociodemograficosDto.js';
import type { CpfSociodemograficosDto } from '../dtos/CpfSociodemograficosDto.js';
import type { ICpfSociodemograficos } from '../ports/ICpfSociodemograficos.js';

export class CpfSociodemograficos implements ICpfSociodemograficos {
  readonly path = '/cpf-sociodemograficos';
  readonly creditValue = 2.5;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfSociodemograficosDto>> {
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

    return parseOrSchemaError(CpfSociodemograficosSchema, result.value, 'apibrasil');
  }
}
