/**
 * @fileoverview Operação de busca genérica no Escavador.
 * Busca por query livre (texto), filtrando por tipo (pessoa_fisica, instituicao, etc.)
 * com paginação.
 * @module infrastructure/providers/escavador/operations/BuscarGeral
 */

import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { type BuscaGeralResponse, BuscaGeralResponseSchema } from '../dtos/BuscaGeralDto.js';
import type { BuscarGeralInput, IBuscarGeral } from '../ports/IBuscarGeral.js';

/**
 * Operação de busca genérica no Escavador (GET /api/v1/busca).
 * Implementa IBuscarGeral para padrão de operação.
 *
 * @class BuscarGeral
 * @implements {IBuscarGeral}
 */
export class BuscarGeral implements IBuscarGeral {
  /**
   * Constrói operação de busca com cliente HTTP.
   *
   * @param {IHttpClient} http - Cliente HTTP ao Escavador
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Busca genérica por query e tipo (pessoa ou instituição).
   * Faz parsing e validação do schema da resposta.
   *
   * @async
   * @param {BuscarGeralInput} input - Query, tipo, e número de página
   * @returns {Promise<Either<SourceError, BuscaGeralResponse>>} Lista de resultados ou erro
   */
  async execute(input: BuscarGeralInput): Promise<Either<SourceError, BuscaGeralResponse>> {
    const result = await this.http.request<unknown>('/api/v1/busca', {
      params: {
        q: input.query,
        tipo: input.tipo,
        page: input.pagina,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = BuscaGeralResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
