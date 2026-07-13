import { createFinderJobProcessorFromEnvironment } from '@application/finder/FinderSourceRegistryFactory.js';
import { Pool } from 'pg';
import { resolveWorkerProcessor } from '../src/worker.js';

describe('resolveWorkerProcessor', () => {
  it('uses default composition when WORKER_PROCESSOR_MODULE is absent', async () => {
    const pool = new Pool({
      connectionString: 'postgres://unused:unused@localhost:5432/clothos_core',
    });
    const buildDefaultProcessor = jest.fn(() =>
      createFinderJobProcessorFromEnvironment(pool, {
        ESCAVADOR_API_KEY: 'escavador-token',
        DATAJUD_APIKEY: 'datajud-token',
        DIRECTDATA_TOKEN: 'directdata-token',
      }),
    );

    try {
      await expect(resolveWorkerProcessor(undefined, buildDefaultProcessor)).resolves.toEqual(
        expect.any(Function),
      );
      expect(buildDefaultProcessor).toHaveBeenCalledTimes(1);
    } finally {
      await pool.end();
    }
  });

  it('propagates default composition configuration failures', async () => {
    await expect(
      resolveWorkerProcessor(undefined, () => {
        throw new Error('missing_provider_configuration:ESCAVADOR_API_KEY');
      }),
    ).rejects.toThrow('missing_provider_configuration:ESCAVADOR_API_KEY');
  });
});
