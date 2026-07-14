import { JobQueue } from '@shared/domain/enums/queue.js';
import { buildDefaultProcessor } from '../src/worker.js';

const monitorEnvironment = {
  DATAJUD_APIKEY: 'datajud-token',
  ESCAVADOR_API_KEY: 'escavador-token',
};

describe('buildDefaultProcessor', () => {
  const original = process.env;

  afterEach(() => {
    process.env = original;
  });

  it('a fila monitor sobe sem credencial de DirectData (o Finder a exige; o monitor não)', () => {
    // Regressão: se o worker de monitoramento usasse a fábrica do Finder, ele não subiria
    // sem DIRECTDATA_TOKEN — e a fila `monitor` ficaria eternamente sem consumidor.
    process.env = { ...monitorEnvironment };

    expect(() => buildDefaultProcessor(JobQueue.MONITOR)).not.toThrow();
    expect(typeof buildDefaultProcessor(JobQueue.MONITOR)).toBe('function');
  });

  it('a fila monitor exige as credenciais das suas duas fontes', () => {
    process.env = { DATAJUD_APIKEY: 'datajud-token' };

    expect(() => buildDefaultProcessor(JobQueue.MONITOR)).toThrow(
      'missing_provider_configuration:ESCAVADOR_API_KEY',
    );
  });

  it('as demais filas continuam recebendo o processador do Finder', () => {
    // O Finder exige DirectData: a ausência prova que a fila `full` não caiu no monitor.
    process.env = { ...monitorEnvironment };

    expect(() => buildDefaultProcessor(JobQueue.FULL)).toThrow(
      'missing_provider_configuration:DIRECTDATA_TOKEN',
    );
  });
});
