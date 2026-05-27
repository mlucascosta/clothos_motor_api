/**
 * @fileoverview Port (contrato) para iniciar busca assíncrona por identificador no Escavador.
 * Define contrato para operação que inicia busca de longa duração com polling.
 * @module infrastructure/providers/escavador/ports/IIniciarBuscaProcessosCpfCnpj
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaLoteResponse } from '../dtos/BuscaAssincronaDto.js';

/**
 * Parâmetros de entrada para iniciar busca assíncrona por identificador.
 * Mapeia-se para `POST /api/v1/processos/tribunal/cpf-cnpj`
 *
 * @typedef {Object} IniciarBuscaProcessosCpfCnpjInput
 * @property {string} cpfCnpj - Identificador a buscar (com ou sem formatação)
 * @property {string[]} [tribunais] - Lista de tribunais a filtrar (opcional, padrão: todos)
 */
export interface IniciarBuscaProcessosCpfCnpjInput {
  /** Identificador a buscar (com ou sem formatação) */
  cpfCnpj: string;
  /** Tribunais específicos a buscar (ex: ["TJSP", "TST"]) (opcional) */
  tribunais?: string[];
}

/**
 * Port (interface) para iniciar busca assíncrona por identificador.
 * Implementação agnóstica do HTTP transport.
 *
 * Padrão assíncrono:
 * 1. Cliente chama `execute()` com identificador
 * 2. Servidor retorna ID de busca (status: 'pendente' ou 'em_andamento')
 * 3. Cliente faz polling com `IObterBuscaAssincrona` até conclusão
 *
 * Responsabilidades:
 * - Receber identificador e tribunais opcionais
 * - Executar POST contra API Escavador
 * - Retornar Either com erro ou ID para polling
 *
 * @interface IIniciarBuscaProcessosCpfCnpj
 */
export interface IIniciarBuscaProcessosCpfCnpj {
  execute(
    input: IniciarBuscaProcessosCpfCnpjInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>>;
}
