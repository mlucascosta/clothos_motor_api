import type { JobRepository, JobRow } from '@infrastructure/database/JobRepository.js';
import type { JobQueueValue, JobStatusValue } from '@shared/domain/enums/queue.js';
import { logger } from '@shared/infrastructure/logger.js';
import { redactSecrets } from '@shared/infrastructure/redactSecrets.js';

export interface JobProcessResult {
  result: Record<string, unknown>;
  costActual: number;
  /** JobStatus.COMPLETED | JobStatus.PARTIAL — contrato numerico da fila. */
  status?: JobStatusValue;
}

export type JobProcessor = (job: JobRow, signal: AbortSignal) => Promise<JobProcessResult>;

export interface JobWorkerOptions {
  pollIntervalMs?: number;
  heartbeatIntervalMs?: number;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Runs one queue consumer. The processor receives an AbortSignal when shutdown
 * starts or lease ownership is lost, and terminal writes remain token-guarded.
 */
export class JobWorker {
  private readonly pollIntervalMs: number;
  private readonly heartbeatIntervalMs: number;
  private stopping = false;
  private activeProcessor: AbortController | null = null;

  constructor(
    private readonly repository: JobRepository,
    private readonly queue: JobQueueValue,
    private readonly processor: JobProcessor,
    options: JobWorkerOptions = {},
  ) {
    this.pollIntervalMs = options.pollIntervalMs ?? 1_000;
    this.heartbeatIntervalMs = options.heartbeatIntervalMs ?? 10_000;
  }

  stop(): void {
    this.stopping = true;
    this.activeProcessor?.abort();
  }

  async run(): Promise<void> {
    while (!this.stopping) {
      await this.repository.reclaimExpired();
      const job = await this.repository.claimNext(this.queue);

      if (job === null) {
        await sleep(this.pollIntervalMs);
        continue;
      }

      await this.process(job);
    }
  }

  private async process(job: JobRow): Promise<void> {
    const claimToken = job.claim_token;
    if (claimToken === null) {
      logger.error({ jobId: job.id }, 'JobWorker: claim returned without token');
      return;
    }

    const controller = new AbortController();
    this.activeProcessor = controller;
    const heartbeat = setInterval(() => {
      void this.repository.heartbeat(job.id, claimToken).then(
        (owned) => {
          if (!owned) controller.abort();
        },
        (err: unknown) => {
          logger.error({ err, jobId: job.id }, 'JobWorker: heartbeat failed');
          controller.abort();
        },
      );
    }, this.heartbeatIntervalMs);

    try {
      const outcome = await this.processor(job, controller.signal);
      const completed = await this.repository.complete(
        job.id,
        claimToken,
        outcome.result,
        outcome.costActual,
        outcome.status,
      );
      if (!completed) {
        logger.warn({ jobId: job.id }, 'JobWorker: completion rejected because claim was lost');
      }
    } catch (err) {
      const failed = await this.repository.fail(job.id, claimToken, {
        // Redigido: esta mensagem é persistida no job e lida por operação/Laravel.
        // Um processor pode lançar erro carregando credencial (connection string,
        // header de provider) que viraria segredo em banco.
        error: err instanceof Error ? redactSecrets(err.message) : 'processor_failed',
      });
      if (!failed) {
        logger.warn({ jobId: job.id }, 'JobWorker: failure update rejected because claim was lost');
      }
    } finally {
      clearInterval(heartbeat);
      this.activeProcessor = null;
    }
  }
}
