import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  JobEventType,
  JobQueue,
  JobStatus,
  SourceErrorKind,
  SourceExecutionStatus,
  jobQueueFromName,
  sourceErrorKindFromName,
} from '@shared/domain/enums/queue.js';

/**
 * Gêmeo de clothos_src/tests/Feature/Contract/QueueEnumContractTest.php.
 *
 * Os dois leem o MESMO `docs/enums/queue-contract.json`. Se um dos lados mudar um número
 * sozinho, a suíte do lado que divergiu quebra — que é o único jeito de pegar um drift que,
 * em produção, se manifestaria como job nunca reclamado, sem erro nenhum.
 */
const contract = JSON.parse(
  readFileSync(
    join(__dirname, '..', '..', '..', '..', '..', 'docs', 'enums', 'queue-contract.json'),
    'utf-8',
  ),
) as Record<string, Record<string, number>>;

function expectMatchesContract(actual: Record<string, number>, key: string): void {
  const expected = contract[key];
  expect(expected).toBeDefined();
  // Igualdade exata nos dois sentidos: o motor não pode faltar nem sobrar um estado.
  expect(actual).toEqual(expected);
}

describe('contrato numérico da fila', () => {
  it('JobStatus bate com o contrato', () => expectMatchesContract(JobStatus, 'JobStatus'));
  it('JobQueue bate com o contrato', () => expectMatchesContract(JobQueue, 'JobQueue'));
  it('JobEventType bate com o contrato', () => expectMatchesContract(JobEventType, 'JobEventType'));
  it('SourceExecutionStatus bate com o contrato', () =>
    expectMatchesContract(SourceExecutionStatus, 'SourceExecutionStatus'));
  it('SourceErrorKind bate com o contrato', () =>
    expectMatchesContract(SourceErrorKind, 'SourceErrorKind'));
});

describe('jobQueueFromName', () => {
  it('traduz o nome operado por humano (WORKER_QUEUE) para o número do protocolo', () => {
    expect(jobQueueFromName('full')).toBe(JobQueue.FULL);
    expect(jobQueueFromName('monitor')).toBe(JobQueue.MONITOR);
    expect(jobQueueFromName(' LITE ')).toBe(JobQueue.LITE);
  });

  it('falha fechado numa fila desconhecida', () => {
    // Um typo em WORKER_QUEUE derrubaria o worker no boot — em vez de deixá-lo rodando
    // eternamente sem reclamar job nenhum, que é como um typo se manifestava antes.
    expect(() => jobQueueFromName('ful')).toThrow('unknown_worker_queue:ful');
  });
});

describe('sourceErrorKindFromName', () => {
  it('mapeia os kinds do SourceError', () => {
    expect(sourceErrorKindFromName('TIMEOUT')).toBe(SourceErrorKind.TIMEOUT);
    expect(sourceErrorKindFromName('CIRCUIT_OPEN')).toBe(SourceErrorKind.CIRCUIT_OPEN);
  });

  it('kind desconhecido vira UPSTREAM_ERROR em vez de gravar nulo', () => {
    expect(sourceErrorKindFromName('QUALQUER_COISA')).toBe(SourceErrorKind.UPSTREAM_ERROR);
  });
});
