/**
 * @fileoverview Módulo de persistência — exporta store singleton e tipos.
 * Responsável por armazenamento de resultados brutos em MongoDB.
 * @module infrastructure/persistence
 */

import { MongoRawResultStore } from './MongoRawResultStore.js';

export { MongoRawResultStore };
export type { IRawResultStore } from './IRawResultStore.js';
export type { RawResultDoc } from './RawResultDoc.js';

/**
 * Store singleton para resultados brutos.
 * Compartilhado em toda aplicação para persistência de respostas de provedores.
 *
 * @type {MongoRawResultStore}
 */
export const rawStore = new MongoRawResultStore();
