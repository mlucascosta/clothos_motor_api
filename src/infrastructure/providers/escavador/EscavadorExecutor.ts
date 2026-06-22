/**
 * @fileoverview Executor de consultas ao provedor Escavador.
 * Implementa o adaptador de integração com a API Escavador (v1)
 * para busca de dados de pessoas (CPF) e instituições (CNPJ).
 * @module infrastructure/providers/escavador/EscavadorExecutor
 */

import type {
  ISourceExecutor,
  SourceContext,
  SourceResult,
} from '@application/queries/ports/ISourceExecutor.js';
import { type Either, isLeft, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import { cleanDocument } from '@shared/domain/identifiers.js';
import type { BuscaResultItem } from './dtos/BuscaGeralDto.js';
import type { ProcessoResumido } from './dtos/PessoaDto.js';
import type { IBuscarGeral } from './ports/IBuscarGeral.js';
import type { IIniciarBuscaLote } from './ports/IIniciarBuscaLote.js';
import type { IObterBuscaAssincrona } from './ports/IObterBuscaAssincrona.js';
import type { IObterInstituicao } from './ports/IObterInstituicao.js';
import type { IObterPessoa } from './ports/IObterPessoa.js';
import type { IObterProcessosInstituicao } from './ports/IObterProcessosInstituicao.js';
import type { IObterProcessosPessoa } from './ports/IObterProcessosPessoa.js';

const POLL_INTERVAL_MS = 2_000;
const MAX_POLL_ATTEMPTS = 10;

/**
 * Dependências do executor Escavador.
 * @interface EscavadorExecutorDeps
 * @property {IBuscarGeral} buscarGeral - Operação de busca genérica (por query)
 * @property {IObterPessoa} obterPessoa - Obter detalhes de pessoa física
 * @property {IObterProcessosPessoa} obterProcessosPessoa - Listar processos de uma pessoa
 * @property {IObterInstituicao} obterInstituicao - Obter detalhes de instituição (empresa/CNPJ)
 * @property {IObterProcessosInstituicao} obterProcessosInstituicao - Listar processos de uma instituição
 * @property {IIniciarBuscaLote} iniciarBuscaLote - Iniciar busca assíncrona (por CPF/CNPJ ou nome)
 * @property {IObterBuscaAssincrona} obterBuscaAssincrona - Obter resultado de busca assíncrona
 */
export interface EscavadorExecutorDeps {
  buscarGeral: IBuscarGeral;
  obterPessoa: IObterPessoa;
  obterProcessosPessoa: IObterProcessosPessoa;
  obterInstituicao: IObterInstituicao;
  obterProcessosInstituicao: IObterProcessosInstituicao;
  iniciarBuscaLote: IIniciarBuscaLote;
  obterBuscaAssincrona: IObterBuscaAssincrona;
}

/**
 * Executor de consultas Escavador.
 * Implementa `ISourceExecutor` para padronizar integração com provedores de dados.
 * Suporta dois fluxos:
 * - CNPJ: busca síncrona direto na API (BuscarGeral + ObterInstituicao + ObterProcessosInstituicao)
 * - CPF: busca assíncrona com polling (IniciarBuscaProcessosCpfCnpj + poll ObterBuscaAssincrona)
 *
 * @class EscavadorExecutor
 * @implements {ISourceExecutor}
 */
export class EscavadorExecutor implements ISourceExecutor {
  /** @type {string} Nome do provedor (identificador único) */
  readonly sourceName = 'escavador';

  /**
   * Constrói executor Escavador com dependências injetadas.
   * @param {EscavadorExecutorDeps} deps - Dependências (operações HTTP ao provedor)
   */
  constructor(private readonly deps: EscavadorExecutorDeps) {}

  /**
   * Executa consulta no Escavador (ponto de entrada do ISourceExecutor).
   * Determina fluxo (CPF assíncrono vs CNPJ síncrono) baseado no tipo de identificador.
   *
   * @async
   * @param {SourceContext} context - Contexto com identificador (CPF ou CNPJ), timeoutMs, etc.
   * @returns {Promise<Either<SourceError, SourceResult>>} Resultado com dados brutos ou erro
   * @throws Não lança; retorna Left(SourceError) em falhas
   */
  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    const start = Date.now();

    if (context.identifierKind === 'CNPJ') {
      return this.executeForCnpj(context, start);
    }

    return this.executeForCpf(context, start);
  }

  /**
   * Executa fluxo de busca para CNPJ (síncrono).
   * Fases: (1) BuscarGeral por CNPJ, (2) encontrar melhor match, (3) paralelo ObterInstituicao + ObterProcessos
   *
   * @async
   * @private
   * @param {SourceContext} context - Contexto com CNPJ como identifier
   * @param {number} start - Timestamp início da execução (para cálculo de latência)
   * @returns {Promise<Either<SourceError, SourceResult>>} Dados estruturados com detalhes e processos
   */
  private async executeForCnpj(
    context: SourceContext,
    start: number,
  ): Promise<Either<SourceError, SourceResult>> {
    const buscaResult = await this.deps.buscarGeral.execute({
      query: context.identifier,
      tipo: 'instituicao',
    });

    if (isLeft(buscaResult)) return buscaResult;

    const entidade = this.findBestMatch(buscaResult.value.items, context.identifier);
    if (!entidade) {
      return left(new SourceError('NOT_FOUND', this.sourceName, 'Nenhuma instituição encontrada'));
    }

    const [detalhes, processos] = await Promise.all([
      this.deps.obterInstituicao.execute({ id: entidade.id }),
      this.deps.obterProcessosInstituicao.execute({ id: entidade.id, pagina: 1 }),
    ]);

    const data: Record<string, unknown> = {
      entidade_id: entidade.id,
      nome: entidade.nome,
      tipo: 'instituicao',
      sources: ['escavador'],
    };

    if (!isLeft(detalhes)) {
      data['detalhes'] = detalhes.value;
    }

    let cost = 1;
    if (!isLeft(processos)) {
      data['processos'] = processos.value.items;
      data['total_processos'] = processos.value.total;
      cost += this.calcCostProcessos(processos.value.items);
    }

    return right({
      source: this.sourceName,
      data,
      cost,
      latency_ms: Date.now() - start,
    });
  }

  /**
   * Executa fluxo de busca para CPF (assíncrono com polling).
   * Fases: (1) IniciarBuscaProcessosCpfCnpj, (2) poll com timeout até conclusão, (3) extrair resultado
   *
   * @async
   * @private
   * @param {SourceContext} context - Contexto com CPF como identifier
   * @param {number} start - Timestamp início da execução
   * @returns {Promise<Either<SourceError, SourceResult>>} Resultado com busca assíncrona completa
   */
  private async executeForCpf(
    context: SourceContext,
    start: number,
  ): Promise<Either<SourceError, SourceResult>> {
    const iniciarResult = await this.deps.iniciarBuscaLote.execute({
      tipo: 'busca_por_documento',
      cpfCnpj: context.identifier,
    });

    if (isLeft(iniciarResult)) return iniciarResult;

    const buscaIds = iniciarResult.value.items.map((item) => item.id);
    if (buscaIds.length === 0) {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'Nenhuma busca iniciada'));
    }

    const budget = context.timeoutMs - (Date.now() - start);
    const pollResults = await Promise.all(buscaIds.map((id) => this.pollAssincrona(id, budget)));

    const allResultados: unknown[] = [];
    let pollFailures = 0;
    for (const pr of pollResults) {
      if (isLeft(pr)) {
        pollFailures++;
        continue;
      }
      allResultados.push(pr.value.resultado);
    }

    if (pollFailures === pollResults.length) {
      return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'Todos os polls falharam'));
    }

    const processos = allResultados.flatMap((r) =>
      this.extractProcessosFromResultado(r as Record<string, unknown> | undefined),
    );

    const data: Record<string, unknown> = {
      busca_assincrona_ids: buscaIds,
      tipo: 'pessoa',
      sources: ['escavador'],
      resultados: allResultados,
      processos,
      total_processos: processos.length,
    };

    return right({
      source: this.sourceName,
      data,
      cost: 1 + this.calcCostProcessos(processos),
      latency_ms: Date.now() - start,
    });
  }

  /**
   * Faz poll periódico até conclusão, erro ou timeout da busca assíncrona.
   * Implementa circuit breaker: MAX_POLL_ATTEMPTS ou deadline (budgetMs).
   *
   * @async
   * @private
   * @param {number} id - ID da busca assíncrona no Escavador
   * @param {number} budgetMs - Orçamento de tempo em ms (do timeout original)
   * @returns {Promise<Either<SourceError, { resultado: unknown }>>} Resultado ou erro (timeout/UPSTREAM_ERROR)
   */
  private async pollAssincrona(
    id: number,
    budgetMs: number,
  ): Promise<Either<SourceError, { resultado: unknown }>> {
    const deadline = Date.now() + Math.max(budgetMs, 0);
    let attempts = 0;

    do {
      const result = await this.deps.obterBuscaAssincrona.execute({ id });

      if (isLeft(result)) return result;

      const rawStatus = result.value.status ?? '';
      const status = rawStatus
        .toUpperCase()
        .normalize('NFD')
        // biome-ignore lint/suspicious/noMisleadingCharacterClass: remo\u00E7\u00E3o intencional de marcas diacr\u00EDticas combinantes p\u00F3s-NFD (strip de acentos)
        .replace(/[\u0300-\u036F]/g, '');

      if (status === 'SUCESSO' || status === 'CONCLUIDO') {
        return right({ resultado: result.value.resposta ?? result.value.resultado });
      }

      if (status === 'ERRO' || status === 'NAO_ENCONTRADO') {
        return left(
          new SourceError(
            'UPSTREAM_ERROR',
            this.sourceName,
            `Busca assíncrona: ${result.value.status}`,
          ),
        );
      }

      attempts++;
      if (attempts < MAX_POLL_ATTEMPTS && Date.now() < deadline) {
        await this.sleep(POLL_INTERVAL_MS);
      }
    } while (attempts < MAX_POLL_ATTEMPTS && Date.now() < deadline);

    return left(new SourceError('TIMEOUT', this.sourceName, 'Polling esgotado sem conclusão'));
  }

  /**
   * Encontra melhor match entre resultados de busca genérica.
   * Estratégia: match exato por CNPJ, fallback para primeiro item.
   *
   * @private
   * @param {BuscaResultItem[]} items - Lista de resultados da busca
   * @param {string} cnpj - CNPJ a buscar (com ou sem formatação)
   * @returns {BuscaResultItem | undefined} Item encontrado ou undefined se lista vazia
   */
  private findBestMatch(items: BuscaResultItem[], cnpj: string): BuscaResultItem | undefined {
    const clean = cleanDocument(cnpj);
    return (
      items.find((i) => {
        const itemCnpj = i['cnpj'] as string | undefined;
        return itemCnpj !== undefined && cleanDocument(itemCnpj) === clean;
      }) ?? items[0]
    );
  }

  /**
   * Extrai array de processos do resultado da busca assíncrona.
   * Acessa campo `resultado.processos` se existir e for array.
   *
   * @private
   * @param {Record<string, unknown> | undefined} resultado - Objeto resultado bruto da API
   * @returns {ProcessoResumido[]} Array de processos ou array vazio
   */
  private extractProcessosFromResultado(
    resultado: Record<string, unknown> | undefined,
  ): ProcessoResumido[] {
    if (!resultado) return [];
    const processos = resultado['processos'];
    if (Array.isArray(processos)) return processos as ProcessoResumido[];
    return [];
  }

  /**
   * Calcula custo da consulta baseado em quantidade de processos encontrados.
   * Custo = min(quantidade_processos, 3) para capping de gastos.
   *
   * @private
   * @param {ProcessoResumido[]} processos - Array de processos
   * @returns {number} Custo em créditos (0-3)
   */
  private calcCostProcessos(processos: ProcessoResumido[]): number {
    return Math.min(processos.length, 3);
  }

  /**
   * Aguarda por tempo especificado em ms.
   *
   * @private
   * @param {number} ms - Milissegundos de espera
   * @returns {Promise<void>} Promise que resolve após o tempo
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
