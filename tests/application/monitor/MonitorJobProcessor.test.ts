import { MonitorJobProcessor } from '@application/monitor/MonitorJobProcessor.js';
import type { JobRow } from '@infrastructure/database/JobRepository.js';
import { left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

const CNJ = '0000001-12.2023.8.26.0001';

function job(overrides: Partial<JobRow> = {}): JobRow {
  return {
    id: 1,
    job_id: 'job-uuid',
    queue: 'monitor',
    priority: 5,
    status: 'claimed',
    tenant_slug: 'tenant_acme',
    query_type: 'monitor_check',
    identifier: CNJ,
    plan: 'finder_team',
    payload: {
      protocol_version: 2,
      operation: 'monitor_check',
      monitor_id: 7,
      frequency: 'weekly',
      source: 'cnj',
    },
    result: null,
    cost_reserved: 0,
    cost_actual: null,
    correlation_id: 'correlation-uuid',
    ...overrides,
  } as unknown as JobRow;
}

const dataJudResponse = {
  hits: {
    hits: [
      {
        _source: {
          orgaoJulgador: { nome: '1ª Vara Cível' },
          movimentos: [{ codigo: 51, nome: 'Sentença', dataHora: '2026-06-01T09:00:00Z' }],
        },
      },
    ],
  },
};

function makeSources(overrides: Record<string, unknown> = {}) {
  return {
    cnj: {
      execute: jest
        .fn()
        .mockResolvedValue(
          right({ source: 'datajud', data: dataJudResponse, cost: 0, latency_ms: 5 }),
        ),
    },
    escavador: {
      execute: jest.fn().mockResolvedValue(
        right({
          items: [{ id: 999, data: '2026-05-20', tipo: 'Sentença', descricao: 'Julgado' }],
        }),
      ),
    },
    ...overrides,
    // biome-ignore lint/suspicious/noExplicitAny: test double
  } as any;
}

describe('MonitorJobProcessor', () => {
  it('modalidade Diário consulta o DataJud pelo CNJ e devolve o snapshot normalizado', async () => {
    const sources = makeSources();

    const result = await new MonitorJobProcessor(sources).process(
      job(),
      new AbortController().signal,
    );

    expect(sources.cnj.execute).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: CNJ, identifierKind: 'PROCESSO' }),
    );
    expect(sources.escavador.execute).not.toHaveBeenCalled();
    expect(result).toEqual({
      result: {
        status: 'ok',
        snapshot: {
          movimentos: [
            {
              codigo: '51',
              data: '2026-06-01T09:00:00Z',
              orgao_julgador: '1ª Vara Cível',
              descricao: 'Sentença',
            },
          ],
        },
      },
      costActual: 0,
    });
  });

  it('modalidade Semanal consulta as movimentações do Escavador pelo CNJ', async () => {
    const sources = makeSources();
    const weekly = job({
      payload: {
        protocol_version: 2,
        operation: 'monitor_check',
        monitor_id: 7,
        frequency: 'monthly',
        source: 'escavador',
      },
    });

    const result = await new MonitorJobProcessor(sources).process(
      weekly,
      new AbortController().signal,
    );

    expect(sources.escavador.execute).toHaveBeenCalledWith({ numeroCnj: CNJ });
    expect(sources.cnj.execute).not.toHaveBeenCalled();
    expect(result.result).toEqual({
      status: 'ok',
      snapshot: {
        movimentos: [
          { codigo: '999', data: '2026-05-20', orgao_julgador: '', descricao: 'Julgado' },
        ],
      },
    });
  });

  it('aceita payload jsonb entregue como string pelo driver', async () => {
    const sources = makeSources();
    const stringified = job({
      payload: JSON.stringify({
        protocol_version: 2,
        operation: 'monitor_check',
        monitor_id: 7,
        frequency: 'weekly',
        source: 'cnj',
      }),
    });

    const result = await new MonitorJobProcessor(sources).process(
      stringified,
      new AbortController().signal,
    );

    expect(sources.cnj.execute).toHaveBeenCalled();
    expect(result.costActual).toBe(0);
  });

  it('processo sem movimento devolve snapshot vazio (não é falha)', async () => {
    // Distinção importante: snapshot vazio = "consultei, nada novo"; falha = check_failed.
    const sources = makeSources({
      cnj: {
        execute: jest
          .fn()
          .mockResolvedValue(right({ source: 'datajud', data: { hits: { hits: [] } }, cost: 0 })),
      },
    });

    const result = await new MonitorJobProcessor(sources).process(
      job(),
      new AbortController().signal,
    );

    expect(result.result).toEqual({ status: 'ok', snapshot: { movimentos: [] } });
  });

  it('propaga falha do provider como throw, para o worker aplicar retry/DLQ', async () => {
    // O JobWorker converte throw em fail() (retry até max_attempts; depois failed).
    // O Laravel lê status='failed' e registra check_failed — sem gravar nem cobrar.
    const sources = makeSources({
      cnj: {
        execute: jest
          .fn()
          .mockResolvedValue(left(new SourceError('UPSTREAM_ERROR', 'datajud', 'boom'))),
      },
    });

    await expect(
      new MonitorJobProcessor(sources).process(job(), new AbortController().signal),
    ).rejects.toThrow('boom');
  });

  it('falha fechado em payload que não adere ao contrato', async () => {
    const sources = makeSources();

    await expect(
      new MonitorJobProcessor(sources).process(
        job({ payload: { protocol_version: 1 } }),
        new AbortController().signal,
      ),
    ).rejects.toThrow('invalid_monitor_payload');
    expect(sources.cnj.execute).not.toHaveBeenCalled();
  });

  it('aborta antes de chamar o provider quando o job foi cancelado', async () => {
    const sources = makeSources();
    const controller = new AbortController();
    controller.abort();

    await expect(
      new MonitorJobProcessor(sources).process(job(), controller.signal),
    ).rejects.toThrow('job_aborted');
    expect(sources.cnj.execute).not.toHaveBeenCalled();
  });
});
