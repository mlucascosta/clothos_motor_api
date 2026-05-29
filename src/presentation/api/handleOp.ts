/**
 * @fileoverview Re-exporta handleOp e handleOpVoid pré-configurados com o rawStore singleton.
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
import { rawStore } from '@infrastructure/persistence/index.js';

/**
 * Handler para operações que retornam um corpo (200, 201, 202, etc.).
 * Pré-configurado com o rawStore MongoDB singleton para persistência de auditoria.
 *
 * @template T Tipo do valor retornado em sucesso
 * @param c Contexto Hono da requisição
 * @param opts Metadados de auditoria (gateway, fonte, tipo_param, param)
 * @param execute Função que executa a operação e retorna Either
 * @returns Resposta HTTP serializada com status semântico baseado no SourceError.kind
 */
export function handleOp<T>(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null; statusCode?: number },
  execute: () => Promise<Either<SourceError, T>>,
): Promise<Response> {
  return _handleOp(c, opts, execute, rawStore);
}

/**
 * Handler para operações que retornam sem corpo (204 No Content).
 * Pré-configurado com o rawStore MongoDB singleton para persistência de auditoria.
 *
 * @param c Contexto Hono da requisição
 * @param opts Metadados de auditoria (gateway, fonte, tipo_param, param)
 * @param execute Função que executa a operação e retorna Either<SourceError, void>
 * @returns Resposta HTTP 204 em sucesso ou status semântico de erro
 */
export function handleOpVoid(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null },
  execute: () => Promise<Either<SourceError, void>>,
): Promise<Response> {
  return _handleOpVoid(c, opts, execute, rawStore);
}
