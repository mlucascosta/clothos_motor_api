/**
 * @fileoverview Módulo de persistência — exporta stores singleton e tipos.
 * Migrado de MongoDB para PostgreSQL (ADR-0019: single-store PostgreSQL).
 *
 * Os singletons `rawStore` e `queryRefStore` mantêm os mesmos nomes da versão Mongo
 * para preservar compatibilidade com as rotas e `handleOp`.
 *
 * @module infrastructure/persistence
 */

import { PgQueryRefStore } from './PgQueryRefStore.js';
import { PgRawResultStore } from './PgRawResultStore.js';

export { PgRawResultStore };
export { PgQueryRefStore };
export type { IRawResultStore } from './IRawResultStore.js';
export type { IQueryRefStore } from './IQueryRefStore.js';
export type { RawResultDoc } from './RawResultDoc.js';
export type { QueryRefDoc } from './QueryRefDoc.js';

/**
 * Store singleton para resultados brutos (clothos_core.raw_results).
 * Fire-and-forget; vira no-op se DATABASE_URL não estiver configurado.
 *
 * @type {PgRawResultStore}
 */
export const rawStore = new PgRawResultStore();

/**
 * Store singleton para referências de pesquisa por tenant (clothos_core.query_refs).
 * Salva correlationId↔tenantId quando X-Tenant-Id está presente na requisição.
 * Fire-and-forget; vira no-op se DATABASE_URL não estiver configurado.
 *
 * @type {PgQueryRefStore}
 */
export const queryRefStore = new PgQueryRefStore();
