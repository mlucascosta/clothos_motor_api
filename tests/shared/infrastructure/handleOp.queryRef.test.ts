/**
 * @fileoverview Testes de integração handleOp com query_refs.
 * Valida que X-Tenant-Id dispara save no queryRefStore e que X-Correlation-Id é propagado.
 * @module tests/shared/infrastructure/handleOp.queryRef
 */

import { Hono } from 'hono';
import type { IQueryRefStore } from '../../../src/infrastructure/persistence/IQueryRefStore';
import type { IRawResultStore } from '../../../src/infrastructure/persistence/IRawResultStore';
import type { QueryRefDoc } from '../../../src/infrastructure/persistence/QueryRefDoc';
import type { RawResultDoc } from '../../../src/infrastructure/persistence/RawResultDoc';
import { left, right } from '../../../src/shared/domain/Either';
import { SourceError } from '../../../src/shared/domain/errors/SourceError';
import { handleOp as _handleOp } from '../../../src/shared/infrastructure/handleOp';

function makeStores() {
  const rawSaves: RawResultDoc[] = [];
  const queryRefSaves: QueryRefDoc[] = [];

  const rawStore: IRawResultStore = {
    save: (d) => {
      rawSaves.push(d);
    },
  };
  const queryRefStore: IQueryRefStore = {
    save: (r) => {
      queryRefSaves.push(r);
    },
  };

  return { rawStore, queryRefStore, rawSaves, queryRefSaves };
}

function makeApp(rawStore: IRawResultStore, queryRefStore: IQueryRefStore) {
  const app = new Hono();
  app.get('/test', (c) =>
    _handleOp(
      c,
      { gateway: 'test-gw', fonte: 'test-fonte', tipo_param: 'cpf', param: '111' },
      () => Promise.resolve(right({ result: 'ok' })),
      rawStore,
      queryRefStore,
    ),
  );
  app.get('/test-error', (c) =>
    _handleOp(
      c,
      { gateway: 'test-gw', fonte: 'test-fonte', tipo_param: null, param: null },
      () => Promise.resolve(left(new SourceError('NOT_FOUND', 'test-gw', 'not found'))),
      rawStore,
      queryRefStore,
    ),
  );
  return app;
}

describe('handleOp — query_refs', () => {
  it('não salva query_ref quando X-Tenant-Id está ausente', async () => {
    const { rawStore, queryRefStore, rawSaves, queryRefSaves } = makeStores();
    const app = makeApp(rawStore, queryRefStore);

    const res = await app.request('/test');

    expect(res.status).toBe(200);
    expect(rawSaves).toHaveLength(1);
    expect(queryRefSaves).toHaveLength(0);
  });

  it('salva query_ref quando X-Tenant-Id está presente', async () => {
    const { rawStore, queryRefStore, rawSaves, queryRefSaves } = makeStores();
    const app = makeApp(rawStore, queryRefStore);

    const res = await app.request('/test', {
      headers: { 'X-Tenant-Id': 'tenant-uuid-abc' },
    });

    expect(res.status).toBe(200);
    expect(rawSaves).toHaveLength(1);
    expect(queryRefSaves).toHaveLength(1);
    expect(queryRefSaves[0]?.tenantId).toBe('tenant-uuid-abc');
    expect(queryRefSaves[0]?.gateway).toBe('test-gw');
    expect(queryRefSaves[0]?.fonte).toBe('test-fonte');
  });

  it('propaga X-Correlation-Id para rawresult e query_ref', async () => {
    const { rawStore, queryRefStore, rawSaves, queryRefSaves } = makeStores();
    const app = makeApp(rawStore, queryRefStore);

    await app.request('/test', {
      headers: {
        'X-Tenant-Id': 'tenant-uuid-xyz',
        'X-Correlation-Id': 'corr-id-fixed-123',
      },
    });

    expect(rawSaves[0]?.correlationId).toBe('corr-id-fixed-123');
    expect(queryRefSaves[0]?.correlationId).toBe('corr-id-fixed-123');
  });

  it('gera correlationId quando X-Correlation-Id está ausente', async () => {
    const { rawStore, queryRefStore, rawSaves, queryRefSaves } = makeStores();
    const app = makeApp(rawStore, queryRefStore);

    await app.request('/test', {
      headers: { 'X-Tenant-Id': 'tenant-abc' },
    });

    const corrId = rawSaves[0]?.correlationId;
    expect(corrId).toBeDefined();
    expect(typeof corrId).toBe('string');
    expect(corrId?.length).toBeGreaterThan(0);
    expect(queryRefSaves[0]?.correlationId).toBe(corrId);
  });

  it('salva query_ref mesmo quando a operação retorna erro', async () => {
    const { rawStore, queryRefStore, rawSaves, queryRefSaves } = makeStores();
    const app = makeApp(rawStore, queryRefStore);

    const res = await app.request('/test-error', {
      headers: { 'X-Tenant-Id': 'tenant-error-case' },
    });

    expect(res.status).toBe(404);
    expect(rawSaves).toHaveLength(1);
    expect(rawSaves[0]?.status).toBe('error');
    expect(queryRefSaves).toHaveLength(1);
    expect(queryRefSaves[0]?.tenantId).toBe('tenant-error-case');
  });

  it('correlationId é o mesmo no rawresult e no query_ref', async () => {
    const { rawStore, queryRefStore, rawSaves, queryRefSaves } = makeStores();
    const app = makeApp(rawStore, queryRefStore);

    await app.request('/test', {
      headers: { 'X-Tenant-Id': 'tenant-consistency' },
    });

    expect(rawSaves[0]?.correlationId).toBe(queryRefSaves[0]?.correlationId);
  });
});
