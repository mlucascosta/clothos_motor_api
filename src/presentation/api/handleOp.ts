/**
 * @fileoverview Re-exporta handleOp e handleOpVoid pré-configurados com os stores singleton.
 * As rotas HTTP devem importar deste módulo — nunca de shared/infrastructure/handleOp diretamente.
 * Isso mantém shared/ livre de dependências em infrastructure/.
 * @module presentation/api/handleOp
 */

import type { Context } from 'hono';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import {
  handleOp as _handleOp,
  handleOpVoid as _handleOpVoid,
} from '@shared/infrastructure/handleOp.js';
import { rawStore, queryRefStore } from '@infrastructure/persistence/index.js';

/**
 * Handler para operações que retornam um corpo (200, 201, 202, etc.).
 * Pré-configurado com rawStore e queryRefStore MongoDB singleton.
 *
 * Lê `X-Tenant-Id` e `X-Correlation-Id` automaticamente dos headers.
 * Quando `X-Tenant-Id` está presente salva referência em `query_refs`.
 */
export function handleOp<T>(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null; statusCode?: number },
  execute: () => Promise<Either<SourceError, T>>,
): Promise<Response> {
  return _handleOp(c, opts, execute, rawStore, queryRefStore);
}

/**
 * Handler para operações que retornam sem corpo (204 No Content).
 * Pré-configurado com rawStore e queryRefStore MongoDB singleton.
 */
export function handleOpVoid(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null },
  execute: () => Promise<Either<SourceError, void>>,
): Promise<Response> {
  return _handleOpVoid(c, opts, execute, rawStore, queryRefStore);
}
