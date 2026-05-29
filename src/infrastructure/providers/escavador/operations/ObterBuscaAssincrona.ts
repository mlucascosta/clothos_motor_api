/**
 * @fileoverview Operação de obtenção do status/resultado de busca assíncrona.
 * Consulta o status de uma busca iniciada previamente pelo seu ID.
 * Retorna status (pendente, concluído, erro) e resultado quando disponível.
 * @module infrastructure/providers/escavador/operations/ObterBuscaAssincrona
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { BuscaAssincronaDto } from '../dtos/BuscaAssincronaDto.js';
import { BuscaAssincronaDtoSchema } from '../dtos/BuscaAssincronaDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IObterBuscaAssincrona } from '../ports/IObterBuscaAssincrona.js';

/**
 * Operação de obtenção de status de busca assíncrona (GET /api/v1/async/resultados/{id}).
 * Implementa IObterBuscaAssincrona para padrão de operação.
 *
 * @class ObterBuscaAssincrona
 * @implements {IObterBuscaAssincrona}
 */
export class ObterBuscaAssincrona implements IObterBuscaAssincrona {
  /**
   * Constrói operação de obtenção com cliente HTTP.
   *
   * @param {IHttpClient} http - Cliente HTTP ao Escavador
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Obtém status e resultado (se concluído) de uma busca assíncrona em andamento.
   * Status possíveis: 'pendente' (em andamento), 'concluido' (sucesso), 'erro' (falha).
   *
   * @async
   * @param {Object} input - Input com ID da busca
   * @param {number} input.id - ID da busca assíncrona
   * @returns {Promise<Either<SourceError, BuscaAssincronaDto>>} DTO com status e resultado ou erro
   */
  async execute(input: { id: number }): Promise<Either<SourceError, BuscaAssincronaDto>> {
    const result = await this.http.request<unknown>(`/api/v1/async/resultados/${input.id}`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(BuscaAssincronaDtoSchema, result.value, 'escavador');
  }
}
