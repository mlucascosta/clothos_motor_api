/**
 * @fileoverview Operation AnaliseCreditoEssencialPf — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AnaliseCreditoEssencialPf
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { AnaliseCreditoEssencialPfSchema } from '../dtos/AnaliseCreditoEssencialPfDto.js';
import type { AnaliseCreditoEssencialPfDto } from '../dtos/AnaliseCreditoEssencialPfDto.js';
import type { IAnaliseCreditoEssencialPf } from '../ports/IAnaliseCreditoEssencialPf.js';

export class AnaliseCreditoEssencialPf implements IAnaliseCreditoEssencialPf {
  readonly path = '/analise-credito-essencial-pf';
  readonly creditValue = 15.19;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AnaliseCreditoEssencialPfDto>> {
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

    return parseOrSchemaError(AnaliseCreditoEssencialPfSchema, result.value, 'apibrasil');
  }
}
