/**
 * @fileoverview Operation AnaliseCreditoBasicPf — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AnaliseCreditoBasicPf
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AnaliseCreditoBasicPfSchema } from '../dtos/AnaliseCreditoBasicPfDto.js';
import type { AnaliseCreditoBasicPfDto } from '../dtos/AnaliseCreditoBasicPfDto.js';
import type { IAnaliseCreditoBasicPf } from '../ports/IAnaliseCreditoBasicPf.js';

export class AnaliseCreditoBasicPf implements IAnaliseCreditoBasicPf {
  readonly path = '/analise-credito-basic-pf';
  readonly creditValue = 10.06;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AnaliseCreditoBasicPfDto>> {
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

    return parseOrSchemaError(AnaliseCreditoBasicPfSchema, result.value, 'apibrasil');
  }
}
