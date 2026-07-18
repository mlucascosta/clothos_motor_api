/**
 * @fileoverview Processador da fila `monitor` (04-MONITOR §6) — Fase 6.
 *
 * Executa o poll recorrente de UM processo por **busca ativa** na fonte da sua modalidade
 * (Semanal → DataJud/CNJ; Mensal → Escavador) e devolve o snapshot normalizado no
 * `jobs.result`. Não há webhook nem callback: o Escavador é consultado ativamente.
 *
 * Fronteira de responsabilidade (ADR-0025): o motor **não** toca em schema de tenant, não
 * decide alerta e não deduplica. Ele só busca e normaliza; a detecção de mudança, o dedup
 * por fingerprint e o billing são do Laravel.
 *
 * Erro de provider vira `throw`: o JobWorker converte em `fail()` (retry até
 * `max_attempts`, depois `failed`), e o Laravel lê o terminal `failed` como
 * `check_failed` — nada gravado, nada cobrado. Snapshot vazio é diferente de falha:
 * significa "consultei e não há movimento".
 *
 * @module application/monitor/MonitorJobProcessor
 */

import type { JobProcessResult } from '@application/jobs/JobWorker.js';
import type { ISourceExecutor } from '@application/queries/ports/ISourceExecutor.js';
import type { JobRow } from '@infrastructure/database/JobRepository.js';
import type { IObterMovimentacoesProcesso } from '@infrastructure/providers/escavador/ports/IObterMovimentacoesProcesso.js';
import { isLeft } from '@shared/domain/Either.js';
import { type MonitorSnapshot, parseMonitorJobPayload } from './contracts.js';
import { normalizeDataJudSnapshot, normalizeEscavadorSnapshot } from './normalize.js';

const DEFAULT_TIMEOUT_MS = 30_000;

export interface MonitorSources {
  /** DataJud: aceita `identifierKind: 'PROCESSO'` e deriva o tribunal do próprio CNJ. */
  readonly cnj: ISourceExecutor;
  /** Escavador: movimentações do processo por número CNJ (busca ativa, sem webhook). */
  readonly escavador: IObterMovimentacoesProcesso;
}

export class MonitorJobProcessor {
  constructor(private readonly sources: MonitorSources) {}

  process = async (job: JobRow, signal: AbortSignal): Promise<JobProcessResult> => {
    if (signal.aborted) {
      throw new Error('job_aborted');
    }

    const payload = parseMonitorJobPayload(
      typeof job.payload === 'string' ? JSON.parse(job.payload) : job.payload,
    );

    const snapshot =
      payload.source === 'cnj'
        ? await this.fetchFromDataJud(job)
        : await this.fetchFromEscavador(job);

    return { result: { status: 'ok', snapshot }, costActual: 0 };
  };

  private async fetchFromDataJud(job: JobRow): Promise<MonitorSnapshot> {
    const result = await this.sources.cnj.execute({
      identifier: job.identifier,
      identifierKind: 'PROCESSO',
      tenantSlug: job.tenant_slug,
      correlationId: job.correlation_id,
      timeoutMs: DEFAULT_TIMEOUT_MS,
    });

    if (isLeft(result)) {
      throw result.value;
    }

    return normalizeDataJudSnapshot(result.value.data);
  }

  private async fetchFromEscavador(job: JobRow): Promise<MonitorSnapshot> {
    const result = await this.sources.escavador.execute({ numeroCnj: job.identifier });

    if (isLeft(result)) {
      throw result.value;
    }

    return normalizeEscavadorSnapshot(result.value);
  }
}
