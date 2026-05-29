/**
 * Handler genérico para operations HTTP da API
 * Centraliza tratamento de Either<Error, T>, persistência de auditoria e serialização de resposta
 *
 * @module shared/infrastructure/handleOp
 */

import type { Context } from 'hono';
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';
import type { Either } from '@shared/domain/Either.js';
import { isLeft } from '@shared/domain/Either.js';
import type { SourceError, SourceErrorKind } from '@shared/domain/errors/SourceError.js';
import type { IRawResultStore } from '@infrastructure/persistence/IRawResultStore.js';

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
 * @param store - Store de auditoria (padrão: singleton MongoDB; injetável para testes)
 */
export async function handleOp<T>(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null; statusCode?: number },
  execute: () => Promise<Either<SourceError, T>>,
  store: IRawResultStore,
): Promise<Response> {
  const result = await execute();
  const base = {
    gateway: opts.gateway,
    fonte: opts.fonte,
    tipo_param: opts.tipo_param,
    param: opts.param,
    created_at: new Date(),
  };

  if (isLeft(result)) {
    store.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    const errStatus = (KIND_TO_STATUS[result.value.kind] ?? 500) as ContentfulStatusCode;
    return c.json({ error: result.value.message, kind: result.value.kind }, errStatus) as Response;
  }

  store.save({ ...base, result: result.value, status: 'success' });
  const statusCode = (opts.statusCode ?? 200) as import('hono/utils/http-status').ContentfulStatusCode;
  return c.json(result.value, statusCode) as Response;
}

/**
 * Handler para operações que retornam sem corpo (204 No Content)
 * Persiste auditoria e retorna 204.
 *
 * @param store - Store de auditoria (padrão: singleton MongoDB; injetável para testes)
 */
export async function handleOpVoid(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null },
  execute: () => Promise<Either<SourceError, void>>,
  store: IRawResultStore,
): Promise<Response> {
  const result = await execute();
  const base = {
    gateway: opts.gateway,
    fonte: opts.fonte,
    tipo_param: opts.tipo_param,
    param: opts.param,
    created_at: new Date(),
  };

  if (isLeft(result)) {
    store.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    const errStatus = (KIND_TO_STATUS[result.value.kind] ?? 500) as ContentfulStatusCode;
    return c.json({ error: result.value.message, kind: result.value.kind }, errStatus) as Response;
  }

  store.save({ ...base, result: null, status: 'success' });
  return c.body(null, 204);
}
