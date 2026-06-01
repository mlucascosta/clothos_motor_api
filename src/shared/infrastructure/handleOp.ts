/**
 * Handler genérico para operations HTTP da API
 * Centraliza tratamento de Either<Error, T>, persistência de auditoria e serialização de resposta.
 *
 * Fluxo de auditoria:
 *   1. `raw_results` — salva o resultado bruto (sem dados de tenant)
 *   2. `query_refs`  — salva referência correlationId↔tenantId quando X-Tenant-Id está presente
 *
 * @module shared/infrastructure/handleOp
 */

import type { IQueryRefStore } from '@infrastructure/persistence/IQueryRefStore.js';
import type { IRawResultStore } from '@infrastructure/persistence/IRawResultStore.js';
import type { Either } from '@shared/domain/Either.js';
import { isLeft } from '@shared/domain/Either.js';
import type { SourceError, SourceErrorKind } from '@shared/domain/errors/SourceError.js';
import type { Context } from 'hono';
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';

const KIND_TO_STATUS: Record<SourceErrorKind, StatusCode> = {
  NOT_FOUND: 404,
  AUTH_FAILED: 401,
  RATE_LIMITED: 429,
  TIMEOUT: 504,
  CIRCUIT_OPEN: 503,
  SCHEMA_MISMATCH: 502,
  UPSTREAM_ERROR: 500,
};

/**
 * Handler para operações que retornam um corpo (200, 201, 202, etc.)
 * Persiste auditoria e serializa resposta JSON.
 *
 * Lê automaticamente dos headers:
 *   - `X-Correlation-Id`: ID de correlação para tracing (gerado se ausente)
 *   - `X-Tenant-Id`:      UUID do tenant; quando presente salva em `query_refs`
 *
 * @param store          - Store de resultados brutos (injetável para testes)
 * @param queryRefStore  - Store de referências tenant (opcional; omitir desativa o rastreamento)
 */
export async function handleOp<T>(
  c: Context,
  opts: {
    gateway: string;
    fonte: string;
    tipo_param: string | null;
    param: string | null;
    statusCode?: number;
  },
  execute: () => Promise<Either<SourceError, T>>,
  store: IRawResultStore,
  queryRefStore?: IQueryRefStore,
): Promise<Response> {
  const correlationId = c.req.header('X-Correlation-Id') ?? crypto.randomUUID();
  const tenantId = c.req.header('X-Tenant-Id');

  const result = await execute();
  const now = new Date();
  const base = {
    gateway: opts.gateway,
    fonte: opts.fonte,
    tipo_param: opts.tipo_param,
    param: opts.param,
    correlationId,
    created_at: now,
  };

  if (isLeft(result)) {
    store.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    if (tenantId && queryRefStore) {
      queryRefStore.save({
        correlationId,
        tenantId,
        gateway: opts.gateway,
        fonte: opts.fonte,
        createdAt: now,
      });
    }
    const errStatus = (KIND_TO_STATUS[result.value.kind] ?? 500) as ContentfulStatusCode;
    return c.json({ error: result.value.message, kind: result.value.kind }, errStatus) as Response;
  }

  store.save({ ...base, result: result.value, status: 'success' });
  if (tenantId && queryRefStore) {
    queryRefStore.save({
      correlationId,
      tenantId,
      gateway: opts.gateway,
      fonte: opts.fonte,
      createdAt: now,
    });
  }
  const statusCode = (opts.statusCode ?? 200) as ContentfulStatusCode;
  return c.json(result.value, statusCode) as Response;
}

/**
 * Handler para operações que retornam sem corpo (204 No Content)
 * Persiste auditoria e retorna 204.
 *
 * @param store         - Store de resultados brutos (injetável para testes)
 * @param queryRefStore - Store de referências tenant (opcional)
 */
export async function handleOpVoid(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null },
  execute: () => Promise<Either<SourceError, void>>,
  store: IRawResultStore,
  queryRefStore?: IQueryRefStore,
): Promise<Response> {
  const correlationId = c.req.header('X-Correlation-Id') ?? crypto.randomUUID();
  const tenantId = c.req.header('X-Tenant-Id');

  const result = await execute();
  const now = new Date();
  const base = {
    gateway: opts.gateway,
    fonte: opts.fonte,
    tipo_param: opts.tipo_param,
    param: opts.param,
    correlationId,
    created_at: now,
  };

  if (isLeft(result)) {
    store.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    if (tenantId && queryRefStore) {
      queryRefStore.save({
        correlationId,
        tenantId,
        gateway: opts.gateway,
        fonte: opts.fonte,
        createdAt: now,
      });
    }
    const errStatus = (KIND_TO_STATUS[result.value.kind] ?? 500) as ContentfulStatusCode;
    return c.json({ error: result.value.message, kind: result.value.kind }, errStatus) as Response;
  }

  store.save({ ...base, result: null, status: 'success' });
  if (tenantId && queryRefStore) {
    queryRefStore.save({
      correlationId,
      tenantId,
      gateway: opts.gateway,
      fonte: opts.fonte,
      createdAt: now,
    });
  }
  return c.body(null, 204);
}
