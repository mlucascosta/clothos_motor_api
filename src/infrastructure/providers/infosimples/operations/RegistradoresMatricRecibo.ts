/**
 * @fileoverview Operation — Registradores / Matrícula Recibo
 * Endpoint: POST consultas/registradores/matric/recibo
 * @module infrastructure/providers/infosimples/operations/RegistradoresMatricRecibo
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { RegistradoresMatricReciboResponseSchema, type RegistradoresMatricReciboItem } from '../dtos/RegistradoresMatricReciboDto.js';

export class RegistradoresMatricRecibo implements IInfosimplesOperation<RegistradoresMatricReciboItem> {
  readonly path = 'consultas/registradores/matric/recibo';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, RegistradoresMatricReciboItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(RegistradoresMatricReciboResponseSchema, result.value, 'infosimples');
  }
}
