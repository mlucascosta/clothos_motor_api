/**
 * @fileoverview Operation — Antecedentes Criminais / MG
 * Endpoint: POST consultas/antecedentes-criminais/mg
 * @module infrastructure/providers/infosimples/operations/AntecedenteCriminaisMg
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type AntecedenteCriminaisMgItem,
  AntecedenteCriminaisMgResponseSchema,
} from '../dtos/AntecedenteCriminaisMgDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class AntecedenteCriminaisMg implements IInfosimplesOperation<AntecedenteCriminaisMgItem> {
  readonly path = 'consultas/antecedentes-criminais/mg';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AntecedenteCriminaisMgItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(AntecedenteCriminaisMgResponseSchema, result.value);
  }
}
