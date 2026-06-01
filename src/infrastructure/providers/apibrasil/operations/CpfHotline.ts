/**
 * @fileoverview Operation CpfHotline — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CpfHotline
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CpfHotlineSchema } from '../dtos/CpfHotlineDto.js';
import type { CpfHotlineDto } from '../dtos/CpfHotlineDto.js';
import type { ICpfHotline } from '../ports/ICpfHotline.js';

export class CpfHotline implements ICpfHotline {
  readonly path = '/dados/cpf';
  readonly creditValue = 3.49;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfHotlineDto>> {
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

    return parseOrSchemaError(CpfHotlineSchema, result.value, 'apibrasil');
  }
}
