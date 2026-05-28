/**
 * Handler genérico para operations HTTP da API
 * Centraliza tratamento de Either<Error, T>, persistência de auditoria e serialização de resposta
 *
 * @module shared/infrastructure/handleOp
 */

import type { Context } from 'hono';
import type { Either } from '../domain/Either.js';
import { isLeft } from '../domain/Either.js';
import type { SourceError } from '../domain/errors/SourceError.js';
import { rawStore } from '../../infrastructure/persistence/index.js';

/**
 * Handler para operações que retornam um corpo (200, 201, 202, etc.)
 * Persiste auditoria e serializa resposta JSON
 */
export async function handleOp<T>(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null; statusCode?: number },
  execute: () => Promise<Either<SourceError, T>>,
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
    rawStore.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500) as Response;
  }

  rawStore.save({ ...base, result: result.value, status: 'success' });
  const statusCode = (opts.statusCode ?? 200) as import('hono/utils/http-status').ContentfulStatusCode;
  return c.json(result.value, statusCode) as Response;
}

/**
 * Handler para operações que retornam sem corpo (204 No Content)
 * Persiste auditoria e retorna 204
 */
export async function handleOpVoid(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null },
  execute: () => Promise<Either<SourceError, void | unknown>>,
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
    rawStore.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500) as Response;
  }

  rawStore.save({ ...base, result: null, status: 'success' });
  return c.body(null, 204);
}
