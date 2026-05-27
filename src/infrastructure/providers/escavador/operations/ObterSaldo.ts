/**
 * @fileoverview Operação de obtenção de saldo de créditos no Escavador.
 * Retorna quota disponível e limite de uso.
 * @module infrastructure/providers/escavador/operations/ObterSaldo
 */

import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { SaldoDto } from '../dtos/SaldoDto.js';
import { SaldoDtoSchema } from '../dtos/SaldoDto.js';

/**
 * Interface para operação de obtenção de saldo.
 * @interface IObterSaldo
 */
export interface IObterSaldo {
  /**
   * Executa consulta de saldo de créditos disponíveis.
   * @returns {Promise<Either<SourceError, SaldoDto>>} Saldo e limite ou erro
   */
  execute(): Promise<Either<SourceError, SaldoDto>>;
}

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
    if (result._tag === 'Left') return result;
    const parsed = SaldoDtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
