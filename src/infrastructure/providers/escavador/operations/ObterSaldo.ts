/**
 * @fileoverview Operação de obtenção de saldo de créditos no Escavador.
 * Retorna quota disponível e limite de uso.
 * @module infrastructure/providers/escavador/operations/ObterSaldo
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { SaldoDto } from '../dtos/SaldoDto.js';
import { SaldoDtoSchema } from '../dtos/SaldoDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IObterSaldo } from '../ports/IObterSaldo.js';

/**
 * Operação de obtenção de saldo de créditos (GET /api/v1/quantidade-creditos).
 *
 * @class ObterSaldo
 * @implements {IObterSaldo}
 */
export class ObterSaldo implements IObterSaldo {
  constructor(private readonly http: IHttpClient) {}

  /**
   * Obtém saldo de créditos disponíveis e limite do plano.
   *
   * @returns {Promise<Either<SourceError, SaldoDto>>} Informações de saldo ou erro
   */
  async execute(): Promise<Either<SourceError, SaldoDto>> {
    const result = await this.http.request<unknown>('/api/v1/quantidade-creditos');
    if (isLeft(result)) return result;
    return parseOrSchemaError(SaldoDtoSchema, result.value, 'escavador');
  }
}
