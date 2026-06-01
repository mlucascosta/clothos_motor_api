/**
 * @fileoverview Operation CpfImpedidos — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CpfImpedidos
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CpfImpedidosSchema } from '../dtos/CpfImpedidosDto.js';
import type { CpfImpedidosDto } from '../dtos/CpfImpedidosDto.js';
import type { ICpfImpedidos } from '../ports/ICpfImpedidos.js';

export class CpfImpedidos implements ICpfImpedidos {
  readonly path = '/dados/cpf';
  readonly creditValue = 3.49;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfImpedidosDto>> {
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

    return parseOrSchemaError(CpfImpedidosSchema, result.value, 'apibrasil');
  }
}
