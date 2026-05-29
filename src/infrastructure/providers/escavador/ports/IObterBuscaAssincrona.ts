/**
 * @fileoverview Port (contrato) para obter status e resultado de busca assíncrona.
 * Define operação de polling para monitorar conclusão de busca iniciada.
 * @module infrastructure/providers/escavador/ports/IObterBuscaAssincrona
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BuscaAssincronaDto } from '../dtos/BuscaAssincronaDto.js';

/**
 * Parâmetros de entrada para obter status de busca assíncrona.
 * Mapeia-se para `GET /api/v1/buscas-assincronas/{id}`
 *
 * @typedef {Object} ObterBuscaAssincronaInput
 * @property {number} id - ID da busca assíncrona retornado por IniciarBuscaProcessosCpfCnpj
 */
export interface ObterBuscaAssincronaInput {
  /** ID único da busca assíncrona (obtido em resposta de IniciarBuscaProcessosCpfCnpj) */
  id: number;
}

/**
 * Port (interface) para obter status e resultado de busca assíncrona.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber ID da busca
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou status/resultado da busca
 *
 * @interface IObterBuscaAssincrona
 */
export interface IObterBuscaAssincrona {
  /**
   * Obtém status e resultado de uma busca assíncrona.
   *
   * Usado em padrão de polling:
   * - Status 'pendente' → busca na fila, aguarde
   * - Status 'em_andamento' → processando, aguarde
   * - Status 'concluido' → campo `resultado` contém resposta
   * - Status 'erro' → falha no servidor
   *
   * **Fluxo de polling (típico):**
   * ```
   * 1. obterBuscaAssincrona.execute({ id })
   * 2. Se status='concluido' → acessar resultado e processar
   * 3. Senão → aguardar 1-2s e repetir (máx 10 tentativas)
   * ```
   *
   * @async
   * @param {ObterBuscaAssincronaInput} input - ID da busca
   * @returns {Promise<Either<SourceError, BuscaAssincronaDto>>} Status e resultado ou erro
   *
   * @example
   * ```typescript
   * const result = await obterBuscaAssincrona.execute({ id: 999 });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao obter busca:', result.value.message);
   * } else {
   *   const busca = result.value;
   *   switch (busca.status) {
   *     case 'concluido':
   *       console.log('Resultado:', busca.resultado);
   *       break;
   *     case 'em_andamento':
   *       console.log('Ainda processando...');
   *       break;
   *     case 'erro':
   *       console.error('Busca falhou no servidor');
   *       break;
   *   }
   * }
   * ```
   */
  execute(input: ObterBuscaAssincronaInput): Promise<Either<SourceError, BuscaAssincronaDto>>;
}
