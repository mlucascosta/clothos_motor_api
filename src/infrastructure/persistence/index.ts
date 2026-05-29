/**
 * @fileoverview Módulo de persistência — exporta stores singleton e tipos.
 * @module infrastructure/persistence
 */

import { MongoRawResultStore } from './MongoRawResultStore.js';
import { MongoQueryRefStore } from './MongoQueryRefStore.js';

export { MongoRawResultStore };
export { MongoQueryRefStore };
export type { IRawResultStore } from './IRawResultStore.js';
export type { IQueryRefStore } from './IQueryRefStore.js';
export type { RawResultDoc } from './RawResultDoc.js';
export type { QueryRefDoc } from './QueryRefDoc.js';

/**
 * Store singleton para resultados brutos.
 * @type {MongoRawResultStore}
 */
export const rawStore = new MongoRawResultStore();

/**
 * Store singleton para referências de pesquisa por tenant.
 * Salva correlationId↔tenantId em `query_refs` quando X-Tenant-Id está presente na requisição.
 * @type {MongoQueryRefStore}
 */
export const queryRefStore = new MongoQueryRefStore();
