/**
 * @fileoverview Operation — Registradores / Info Conta
 * Endpoint: POST consultas/registradores/info-conta
 * @module infrastructure/providers/infosimples/operations/RegistradoresInfoConta
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type RegistradoresInfoContaItem,
  RegistradoresInfoContaResponseSchema,
} from '../dtos/RegistradoresInfoContaDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class RegistradoresInfoConta implements IInfosimplesOperation<RegistradoresInfoContaItem> {
  readonly path = 'consultas/registradores/info-conta';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RegistradoresInfoContaItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(RegistradoresInfoContaResponseSchema, result.value, 'infosimples');
  }
}
