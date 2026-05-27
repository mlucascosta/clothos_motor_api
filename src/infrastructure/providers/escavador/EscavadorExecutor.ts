import { left, right, isLeft, type Either } from '../../../shared/domain/Either.js';
import { SourceError } from '../../../shared/domain/errors/SourceError.js';
import type { ISourceExecutor, SourceContext, SourceResult } from '../../../application/queries/ports/ISourceExecutor.js';
import type { IBuscarGeral } from './ports/IBuscarGeral.js';
import type { IObterPessoa } from './ports/IObterPessoa.js';
import type { IObterProcessosPessoa } from './ports/IObterProcessosPessoa.js';
import type { IObterInstituicao } from './ports/IObterInstituicao.js';
import type { IObterProcessosInstituicao } from './ports/IObterProcessosInstituicao.js';
import type { IIniciarBuscaProcessosCpfCnpj } from './ports/IIniciarBuscaProcessosCpfCnpj.js';
import type { IObterBuscaAssincrona } from './ports/IObterBuscaAssincrona.js';
import type { BuscaResultItem } from './dtos/BuscaGeralDto.js';
import type { ProcessoResumido } from './dtos/PessoaDto.js';

const POLL_INTERVAL_MS = 2_000;
const MAX_POLL_ATTEMPTS = 10;

export interface EscavadorExecutorDeps {
  buscarGeral: IBuscarGeral;
  obterPessoa: IObterPessoa;
  obterProcessosPessoa: IObterProcessosPessoa;
  obterInstituicao: IObterInstituicao;
  obterProcessosInstituicao: IObterProcessosInstituicao;
  iniciarBuscaProcessosCpfCnpj: IIniciarBuscaProcessosCpfCnpj;
  obterBuscaAssincrona: IObterBuscaAssincrona;
}

export class EscavadorExecutor implements ISourceExecutor {
  readonly sourceName = 'escavador';

  constructor(private readonly deps: EscavadorExecutorDeps) {}

  async execute(context: SourceContext): Promise<Either<SourceError, SourceResult>> {
    const start = Date.now();

    if (context.identifierKind === 'CNPJ') {
      return this.executeForCnpj(context, start);
    }

    return this.executeForCpf(context, start);
  }

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

  private async executeForCpf(
    context: SourceContext,
    start: number,
  ): Promise<Either<SourceError, SourceResult>> {
    const iniciarResult = await this.deps.iniciarBuscaProcessosCpfCnpj.execute({
      cpfCnpj: context.identifier,
    });

    if (isLeft(iniciarResult)) return iniciarResult;

    const buscaId = iniciarResult.value.id;
    const pollResult = await this.pollAssincrona(buscaId, context.timeoutMs - (Date.now() - start));

    if (isLeft(pollResult)) return pollResult;

    const resultado = pollResult.value.resultado as Record<string, unknown> | undefined;

    const data: Record<string, unknown> = {
      busca_assincrona_id: buscaId,
      tipo: 'pessoa',
      sources: ['escavador'],
      resultado: resultado ?? {},
    };

    const processos = this.extractProcessosFromResultado(resultado);
    data['processos'] = processos;
    data['total_processos'] = processos.length;

    return right({
      source: this.sourceName,
      data,
      cost: 1 + this.calcCostProcessos(processos),
      latency_ms: Date.now() - start,
    });
  }

  private async pollAssincrona(
    id: number,
    budgetMs: number,
  ): Promise<Either<SourceError, { resultado: unknown }>> {
    const deadline = Date.now() + Math.max(budgetMs, 0);
    let attempts = 0;

    while (attempts < MAX_POLL_ATTEMPTS && Date.now() < deadline) {
      const result = await this.deps.obterBuscaAssincrona.execute({ id });

      if (isLeft(result)) return result;

      if (result.value.status === 'concluido') {
        return right({ resultado: result.value.resultado });
      }

      if (result.value.status === 'erro') {
        return left(new SourceError('UPSTREAM_ERROR', this.sourceName, 'Busca assíncrona retornou erro'));
      }

      await this.sleep(POLL_INTERVAL_MS);
      attempts++;
    }

    return left(new SourceError('TIMEOUT', this.sourceName, 'Polling esgotado sem conclusão'));
  }

  private findBestMatch(
    items: BuscaResultItem[],
    cnpj: string,
  ): BuscaResultItem | undefined {
    const clean = cnpj.replace(/\D/g, '');
    return (
      items.find((i) => i.cnpj?.replace(/\D/g, '') === clean) ?? items[0]
    );
  }

  private extractProcessosFromResultado(
    resultado: Record<string, unknown> | undefined,
  ): ProcessoResumido[] {
    if (!resultado) return [];
    const processos = resultado['processos'];
    if (Array.isArray(processos)) return processos as ProcessoResumido[];
    return [];
  }

  private calcCostProcessos(processos: ProcessoResumido[]): number {
    return Math.min(processos.length, 3);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
