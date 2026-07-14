/**
 * @fileoverview Derivacao de chave de cache OPACA para o cache compartilhado.
 * @module shared/domain/privacy/cacheKey
 *
 * A chave e um hash SHA-256 de (fonte | tipo | identificador). Como e um digest,
 * o identificador — inclusive CPF — nunca aparece em claro na chave, no valor de
 * cache nem em log (invariante 00-FOUNDATION / 02-FINDER). Duas consultas ao mesmo
 * identificador na mesma fonte colidem na mesma chave, permitindo reuso do cache.
 */

import { createHash } from 'node:crypto';

/**
 * Deriva a chave opaca de cache para um par (fonte, identificador).
 *
 * @param sourceId Id da fonte registrada (ex.: 'escavador', 'brasilapi').
 * @param identifierKind Tipo do identificador ('CPF' | 'CNPJ' | 'PROCESSO').
 * @param identifier Identificador normalizado (CPF em claro apenas em memoria).
 * @returns hash hex de 64 chars, seguro para persistir e logar.
 */
export function deriveCacheKey(
  sourceId: string,
  identifierKind: string,
  identifier: string,
): string {
  return createHash('sha256').update(`${sourceId}|${identifierKind}|${identifier}`).digest('hex');
}
