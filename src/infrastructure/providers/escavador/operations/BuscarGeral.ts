/**
 * @fileoverview Operação de busca genérica no Escavador.
 * Busca por query livre (texto), filtrando por tipo (pessoa_fisica, instituicao, etc.)
 * com paginação.
 * @module infrastructure/providers/escavador/operations/BuscarGeral
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
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

    if (isLeft(result)) return result;

    return parseOrSchemaError(BuscaGeralResponseSchema, result.value, 'escavador');
  }
}
