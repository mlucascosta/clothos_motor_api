/**
 * @fileoverview Operation — Registradores / Matrícula Recibo
 * Endpoint: POST consultas/registradores/matric/recibo
 * @module infrastructure/providers/infosimples/operations/RegistradoresMatricRecibo
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type RegistradoresMatricReciboItem,
  RegistradoresMatricReciboResponseSchema,
} from '../dtos/RegistradoresMatricReciboDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class RegistradoresMatricRecibo
  implements IInfosimplesOperation<RegistradoresMatricReciboItem>
{
  readonly path = 'consultas/registradores/matric/recibo';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RegistradoresMatricReciboItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(RegistradoresMatricReciboResponseSchema, result.value);
  }
}
