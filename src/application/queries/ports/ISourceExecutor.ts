/**
 * @fileoverview Contrato de execução de fontes de dados para consultas.
 * @module application/queries/ports/ISourceExecutor
 *
 * Define as interfaces para execução de provedores de dados (Escavador, Jusbrasil, etc.)
 * com suporte a contexto de tenant, tracing distribuído e tratamento de erros tipado.
 */

import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';

/**
 * Contexto de execução para uma fonte de dados.
 * @interface SourceContext
 * @description Encapsula metadados necessários para executar uma consulta em uma fonte,
 * incluindo identificação do alvo (CPF/CNPJ), tenant, tracing e timeout.
 */
export interface SourceContext {
  /**
   * Identificador do alvo da pesquisa (CPF ou CNPJ).
   * @type {string}
   */
  identifier: string;

  /**
   * Tipo do identificador: CPF ou CNPJ.
   * @type {'CPF' | 'CNPJ'}
   */
  identifierKind: 'CPF' | 'CNPJ';

  /**
   * Slug do tenant proprietário da consulta.
   * @type {string}
   */
  tenantSlug: string;

  /**
   * ID de correlação para tracing distribuído.
   * Permite rastrear a consulta através de múltiplos serviços e provedores.
   * @type {string}
   */
  correlationId: string;

  /**
   * Timeout em milissegundos para a execução desta fonte.
   * Se excedido, a execução é cancelada e um erro é retornado.
   * @type {number}
   */
  timeoutMs: number;
}

/**
 * Resultado de uma execução de fonte.
 * @interface SourceResult
 * @description Encapsula o resultado positivo de uma consulta, incluindo dados brutos,
 * custo de execução e latência para fins de auditoria e otimização.
 */
export interface SourceResult {
  /**
   * Nome da fonte que executou a consulta.
   * @type {string}
   */
  source: string;

  /**
   * Dados brutos retornados pela fonte, em formato JSON.
   * Estrutura específica de cada provedor.
   * @type {Record<string, unknown>}
   */
  data: Record<string, unknown>;

  /**
   * Custo de execução em créditos do tenant.
   * Deduzido do saldo após settle bem-sucedido.
   * @type {number}
   */
  cost: number;

  /**
   * Latência observada da fonte, em milissegundos.
   * Métrica para SLA e análise de performance.
   * @type {number}
   */
  latency_ms: number;
}

/**
 * Contrato para executores de fontes de dados.
 * @interface ISourceExecutor
 * @description Define o padrão para implementadores de provedores (Escavador, Jusbrasil, etc.).
 * Cada executor é responsável por:
 * - Autenticar e conectar ao provedor
 * - Executar a consulta com timeout
 * - Mapear erros do provedor para {@link SourceError}
 * - Retornar resultado ou erro tipado via Either
 *
 * @see SourceContext
 * @see SourceResult
 * @see SourceError
 */
export interface ISourceExecutor {
  /**
   * Nome único da fonte, usado para identificação e roteamento.
   * @type {string}
   * @readonly
   */
  readonly sourceName: string;

  /**
   * Executa uma consulta nesta fonte.
   * @method execute
   * @param {SourceContext} context - Contexto com metadados da execução
   * @returns {Promise<Either<SourceError, SourceResult>>}
   *   Promessa que resolve para Either:
   *   - Left: erro da execução (timeout, auth, rate-limit, dados inválidos, etc.)
   *   - Right: resultado bem-sucedido com dados, custo e latência
   * @throws Nunca lança exceção; erros são capturados em Either
   */
  execute(context: SourceContext): Promise<Either<SourceError, SourceResult>>;
}
