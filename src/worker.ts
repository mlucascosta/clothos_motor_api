import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createFinderJobProcessorFromEnvironment } from '@application/finder/FinderSourceRegistryFactory.js';
import { type JobProcessor, JobWorker } from '@application/jobs/JobWorker.js';
import { createMonitorJobProcessorFromEnvironment } from '@application/monitor/MonitorProcessorFactory.js';
import { JobRepository } from '@infrastructure/database/JobRepository.js';
import { closePool, getPool } from '@infrastructure/database/pool.js';
import { JobQueue, type JobQueueValue, jobQueueFromName } from '@shared/domain/enums/queue.js';
import { logger } from '@shared/infrastructure/logger.js';

/**
 * O payload de cada fila é um contrato diferente: a fila `monitor` carrega um
 * `monitor_check` e as demais (`full`/`lite`) carregam um job de Finder. Processar uma
 * com o processador da outra falharia o parse de payload em todo job — por isso o
 * processador default é escolhido pela fila que o worker consome.
 */
export function buildDefaultProcessor(queue: JobQueueValue): JobProcessor {
  return queue === JobQueue.MONITOR
    ? createMonitorJobProcessorFromEnvironment()
    : createFinderJobProcessorFromEnvironment(getPool());
}

async function loadProcessor(modulePath: string): Promise<JobProcessor> {
  const moduleUrl = pathToFileURL(resolve(modulePath)).href;
  const processorModule: unknown = await import(moduleUrl);

  if (
    typeof processorModule !== 'object' ||
    processorModule === null ||
    !('default' in processorModule) ||
    typeof processorModule.default !== 'function'
  ) {
    throw new TypeError('WORKER_PROCESSOR_MODULE must default-export a JobProcessor');
  }

  return processorModule.default as JobProcessor;
}

export async function resolveWorkerProcessor(
  modulePath: string | undefined,
  buildDefaultProcessor: () => JobProcessor,
): Promise<JobProcessor> {
  if (modulePath === undefined || modulePath.trim().length === 0) {
    return buildDefaultProcessor();
  }
  return loadProcessor(modulePath);
}

export async function runWorker(processor: JobProcessor, queue: JobQueueValue): Promise<void> {
  const pool = getPool();
  if (pool === null) {
    throw new Error('DATABASE_URL or MOTOR_DATABASE_URL is required to start worker');
  }

  const worker = new JobWorker(new JobRepository(pool), queue, processor);
  const shutdown = (signal: NodeJS.Signals) => {
    logger.info({ signal }, 'JobWorker: graceful shutdown requested');
    worker.stop();
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  try {
    await worker.run();
  } finally {
    process.off('SIGINT', shutdown);
    process.off('SIGTERM', shutdown);
    await closePool();
  }
}

async function main(): Promise<void> {
  // Falha fechado: WORKER_QUEUE com typo derruba o worker no boot, em vez de deixa-lo
  // rodando eternamente sem reclamar job nenhum (que e como um typo se manifestava).
  const queue = jobQueueFromName(process.env['WORKER_QUEUE'] ?? 'full');
  const processor = await resolveWorkerProcessor(process.env['WORKER_PROCESSOR_MODULE'], () =>
    buildDefaultProcessor(queue),
  );
  await runWorker(processor, queue);
}

const entrypoint = process.argv[1];
if (entrypoint !== undefined && pathToFileURL(resolve(entrypoint)).href === import.meta.url) {
  void main().catch((err: unknown) => {
    logger.error({ err }, 'JobWorker: startup failed');
    process.exitCode = 1;
  });
}
