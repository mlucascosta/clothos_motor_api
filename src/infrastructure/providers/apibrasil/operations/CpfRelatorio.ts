/**
 * @fileoverview Operation CpfRelatorio — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CpfRelatorio
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CpfRelatorioSchema } from '../dtos/CpfRelatorioDto.js';
import type { CpfRelatorioDto } from '../dtos/CpfRelatorioDto.js';
import type { ICpfRelatorio } from '../ports/ICpfRelatorio.js';

export class CpfRelatorio implements ICpfRelatorio {
  readonly path = '/cpf-relatorio';
  readonly creditValue = 0.45;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfRelatorioDto>> {
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

    return parseOrSchemaError(CpfRelatorioSchema, result.value, 'apibrasil');
  }
}
