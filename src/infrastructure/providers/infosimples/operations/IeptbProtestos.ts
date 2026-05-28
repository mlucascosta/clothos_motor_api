/**
 * @fileoverview Operation — IEPTB / Protestos
 * Endpoint: POST consultas/ieptb/protestos
 * @module infrastructure/providers/infosimples/operations/IeptbProtestos
 */
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { IeptbProtestosResponseSchema, type IeptbProtestosItem } from '../dtos/IeptbProtestosDto.js';

export class IeptbProtestos implements IInfosimplesOperation<IeptbProtestosItem> {
  readonly path = 'consultas/ieptb/protestos';
  readonly requiredParams = undefined; // oneOf cpf|cnpj tratado no validation-map

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(IeptbProtestosResponseSchema, result.value, 'infosimples');
  }
}
