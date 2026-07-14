/**
 * @fileoverview Enums numéricos do contrato da fila `clothos_core` (ADR-0024 + ADR-0025).
 *
 * ESTES NÚMEROS SÃO O PROTOCOLO entre Laravel e motor. O espelho vive em
 * `clothos_src/app/Enums/{JobStatus,JobQueue,JobEventType,SourceExecutionStatus,SourceErrorKind}.php`.
 * Alterar um valor aqui sem alterar lá quebra a fila **em silêncio** — nenhum erro, apenas jobs
 * que nunca são reclamados ou resultados que nunca são consumidos.
 *
 * O mapa oficial é `docs/DICIONARIO-DE-ENUMS.md` §1. Ele manda; o código segue.
 *
 * @module shared/domain/enums/queue
 */

/** `clothos_core.jobs.status` */
export const JobStatus = {
  PENDING: 0,
  CLAIMED: 1,
  COMPLETED: 2,
  PARTIAL: 3,
  FAILED: 4,
} as const;
export type JobStatusValue = (typeof JobStatus)[keyof typeof JobStatus];

/** `clothos_core.jobs.queue` — cada fila tem um contrato de payload e um processador próprios. */
export const JobQueue = {
  LITE: 0,
  FULL: 1,
  MONITOR: 2,
  DOSSIER: 3,
  EXPORT: 4,
  GRAPH: 5,
  CUSTOM: 6,
} as const;
export type JobQueueValue = (typeof JobQueue)[keyof typeof JobQueue];

const QUEUE_BY_NAME: Record<string, JobQueueValue> = {
  lite: JobQueue.LITE,
  full: JobQueue.FULL,
  monitor: JobQueue.MONITOR,
  dossier: JobQueue.DOSSIER,
  export: JobQueue.EXPORT,
  graph: JobQueue.GRAPH,
  custom: JobQueue.CUSTOM,
};

/**
 * Traduz o nome da fila (vem de `WORKER_QUEUE`, que é operado por humano) para o número do
 * protocolo. Falha fechado: uma fila desconhecida derruba o worker no boot em vez de deixá-lo
 * rodando eternamente sem reclamar nada — que é como um typo se manifestaria.
 */
export function jobQueueFromName(name: string): JobQueueValue {
  const queue = QUEUE_BY_NAME[name.trim().toLowerCase()];
  if (queue === undefined) {
    throw new Error(`unknown_worker_queue:${name}`);
  }
  return queue;
}

/** `clothos_core.job_events.event_type` */
export const JobEventType = {
  PROGRESS: 0,
  SOURCE_COMPLETED: 1,
  SOURCE_FAILED: 2,
  CANDIDATE_SELECTION_REQUIRED: 3,
} as const;
export type JobEventTypeValue = (typeof JobEventType)[keyof typeof JobEventType];

/** `clothos_core.job_source_executions.status` e `raw_results.status` */
export const SourceExecutionStatus = {
  STARTED: 0,
  COMPLETED: 1,
  FAILED: 2,
} as const;
export type SourceExecutionStatusValue =
  (typeof SourceExecutionStatus)[keyof typeof SourceExecutionStatus];

/** `job_source_executions.error_kind` — espelha `SourceError.kind`. */
export const SourceErrorKind = {
  TIMEOUT: 0,
  SCHEMA_MISMATCH: 1,
  AUTH_FAILED: 2,
  CIRCUIT_OPEN: 3,
  RATE_LIMITED: 4,
  NOT_FOUND: 5,
  UPSTREAM_ERROR: 6,
} as const;
export type SourceErrorKindValue = (typeof SourceErrorKind)[keyof typeof SourceErrorKind];

/** Converte o `kind` textual do `SourceError` para o número gravado no banco. */
export function sourceErrorKindFromName(kind: string): SourceErrorKindValue {
  const value = (SourceErrorKind as Record<string, SourceErrorKindValue | undefined>)[kind];
  return value ?? SourceErrorKind.UPSTREAM_ERROR;
}
