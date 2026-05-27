/**
 * @fileoverview Port (contrato) para obter saldo de créditos da conta Escavador.
 * Define operação sem parâmetros para verificar disponibilidade de créditos.
 * @module infrastructure/providers/escavador/ports/IObterSaldo
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { SaldoDto } from '../dtos/SaldoDto.js';

/**
 * Port (interface) para obter saldo de créditos da conta.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou informações de saldo
 * - Sem parâmetros (usa credenciais da conta autenticada)
 *
 * @interface IObterSaldo
 */
export interface IObterSaldo {
  /**
   * Obtém saldo de créditos e informações de renovação da conta.
   *
   * Retorna:
   * - Saldo disponível em créditos
   * - Saldo consumido neste período
   * - Limite máximo do período
   * - Data de renovação
   *
   * **Uso:**
   * Verificar disponibilidade antes de realizar consultas custosas.
   *
   * @async
   * @returns {Promise<Either<SourceError, SaldoDto>>} Informações de saldo ou erro
   *
   * @example
   * ```typescript
   * const result = await obterSaldo.execute();
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter saldo:', result.value.message);
   * } else {
   *   const saldo = result.value;
   *   console.log(`Saldo: ${saldo.saldo} / ${saldo.limite} créditos`);
   *   console.log(`Consumido: ${saldo.saldo_utilizado}`);
   *   console.log(`Renovação em: ${saldo.renovacao_em}`);
   *
   *   if (saldo.saldo < 10) {
   *     console.warn('Saldo baixo! Considere renovar.');
   *   }
   * }
   * ```
   */
  execute(): Promise<Either<SourceError, SaldoDto>>;
}
