/**
 * @fileoverview Operation — Registradores / Matrícula Lista
 * Endpoint: POST consultas/registradores/matric/lista
 * @module infrastructure/providers/infosimples/operations/RegistradoresMatricLista
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type RegistradoresMatricListaItem,
  RegistradoresMatricListaResponseSchema,
} from '../dtos/RegistradoresMatricListaDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class RegistradoresMatricLista
  implements IInfosimplesOperation<RegistradoresMatricListaItem>
{
  readonly path = 'consultas/registradores/matric/lista';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RegistradoresMatricListaItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(RegistradoresMatricListaResponseSchema, result.value);
  }
}
