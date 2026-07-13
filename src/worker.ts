import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createFinderJobProcessorFromEnvironment } from '@application/finder/FinderSourceRegistryFactory.js';
import { type JobProcessor, JobWorker } from '@application/jobs/JobWorker.js';
import { JobRepository } from '@infrastructure/database/JobRepository.js';
import { closePool, getPool } from '@infrastructure/database/pool.js';
import { logger } from '@shared/infrastructure/logger.js';

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

export async function runWorker(processor: JobProcessor, queue: string): Promise<void> {
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
  const processor = await resolveWorkerProcessor(process.env['WORKER_PROCESSOR_MODULE'], () =>
    createFinderJobProcessorFromEnvironment(getPool()),
  );
  await runWorker(processor, process.env['WORKER_QUEUE'] ?? 'full');
}

const entrypoint = process.argv[1];
if (entrypoint !== undefined && pathToFileURL(resolve(entrypoint)).href === import.meta.url) {
  void main().catch((err: unknown) => {
    logger.error({ err }, 'JobWorker: startup failed');
    process.exitCode = 1;
  });
}
