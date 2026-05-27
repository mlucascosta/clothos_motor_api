/**
 * @fileoverview Operação de inicialização de busca assíncrona por CPF/CNPJ.
 * Inicia busca de processos jurídicos associados a CPF ou CNPJ no Escavador.
 * Retorna ID da busca para polling posterior.
 * @module infrastructure/providers/escavador/operations/IniciarBuscaProcessosCpfCnpj
 */

import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IIniciarBuscaProcessosCpfCnpj, IniciarBuscaProcessosCpfCnpjInput } from '../ports/IIniciarBuscaProcessosCpfCnpj.js';
import { IniciarBuscaResponseSchema, type IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

/**
 * Operação de iniciação de busca assíncrona por CPF/CNPJ (POST /api/v1/processos/pesquisar-por-cpf-cnpj).
 * Implementa IIniciarBuscaProcessosCpfCnpj para padrão de operação.
 *
 * @class IniciarBuscaProcessosCpfCnpj
 * @implements {IIniciarBuscaProcessosCpfCnpj}
 */
export class IniciarBuscaProcessosCpfCnpj implements IIniciarBuscaProcessosCpfCnpj {
  /**
   * Constrói operação de busca com cliente HTTP.
   *
   * @param {IHttpClient} http - Cliente HTTP ao Escavador
   */
  constructor(private readonly http: IHttpClient) {}

  /**
   * Inicia busca assíncrona de processos por CPF ou CNPJ.
   * Retorna ID da busca para polling com ObterBuscaAssincrona.
   * Opcionalmente filtra por tribunais.
   *
   * @async
   * @param {IniciarBuscaProcessosCpfCnpjInput} input - CPF/CNPJ e lista opcional de tribunais
   * @returns {Promise<Either<SourceError, IniciarBuscaResponse>>} ID da busca ou erro
   */
  async execute(input: IniciarBuscaProcessosCpfCnpjInput): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/pesquisar-por-cpf-cnpj', {
      method: 'POST',
      body: {
        cpf_cnpj: input.cpfCnpj,
        tribunais: input.tribunais,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = IniciarBuscaResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
