/**
 * @fileoverview Port (contrato) para listar buscas assíncronas iniciadas.
 * Define operação de listagem paginada de buscas em execução ou concluídas.
 * @module infrastructure/providers/escavador/ports/IListarBuscasAssincronas
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarBuscasAssincronasResponse } from '../dtos/BuscaAssincronaDto.js';

/**
 * Parâmetros de entrada para listar buscas assíncronas.
 * Mapeia-se para `GET /api/v1/buscas-assincronas?page=...`
 *
 * @typedef {Object} ListarBuscasAssincronasInput
 * @property {number} [pagina] - Número da página (1-indexed, padrão: 1)
 */
export interface ListarBuscasAssincronasInput {
  /** Número da página para paginação (padrão: 1) */
  pagina?: number;
}

/**
 * Port (interface) para listar todas as buscas assíncronas da conta.
 * Implementação agnóstica do HTTP transport.
 *
 * Responsabilidades:
 * - Receber número de página
 * - Executar GET contra API Escavador
 * - Retornar Either com erro ou lista paginada de buscas
 *
 * @interface IListarBuscasAssincronas
 */
export interface IListarBuscasAssincronas {
  /**
   * Lista todas as buscas assíncronas da conta com paginação.
   *
   * Retorna array com todas as buscas, incluindo:
   * - Status (pendente, em_andamento, concluído, erro)
   * - Resultado se concluído
   * - Timestamps de criação e atualização
   *
   * Útil para auditoria e recuperação de buscas iniciadas anteriormente.
   *
   * @async
   * @param {ListarBuscasAssincronasInput} input - Número de página (opcional)
   * @returns {Promise<Either<SourceError, ListarBuscasAssincronasResponse>>} Lista paginada ou erro
   *
   * @example
   * ```typescript
   * const result = await listarBuscasAssincronas.execute({ pagina: 1 });
   *
   * if (isLeft(result)) {
   *   console.error('Erro ao listar:', result.value.message);
   * } else {
   *   console.log('Buscas na página:', result.value.items.length);
   *   result.value.items.forEach(busca => {
   *     console.log(`ID ${busca.id}: ${busca.status}`);
   *   });
   * }
   * ```
   */
  execute(
    input: ListarBuscasAssincronasInput,
  ): Promise<Either<SourceError, ListarBuscasAssincronasResponse>>;
}
