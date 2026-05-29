/**
 * @fileoverview Persistência de referências de pesquisa por tenant em MongoDB.
 * Armazena na coleção `query_refs` do banco `clothos_motor`.
 * Separado de `raw_results` — o motor não mistura dados de tenant com resultado bruto.
 * @module infrastructure/persistence/MongoQueryRefStore
 */

import { type Collection, MongoClient } from 'mongodb';
import type { IQueryRefStore } from './IQueryRefStore.js';
import type { QueryRefDoc } from './QueryRefDoc.js';
import { logger } from '@shared/infrastructure/logger.js';

/**
 * Store de referências de pesquisa em MongoDB.
 * Implementa padrão singleton com lazy connection (compartilha a mesma string de conexão
 * do MongoRawResultStore — `MONGODB_CLOUD_STRING`).
 *
 * @class MongoQueryRefStore
 */
export class MongoQueryRefStore implements IQueryRefStore {
  private client: MongoClient | null = null;
  private collection: Collection<QueryRefDoc> | null = null;
  private connectingPromise: Promise<Collection<QueryRefDoc> | null> | null = null;

  private connect(): Promise<Collection<QueryRefDoc> | null> {
    if (this.collection) return Promise.resolve(this.collection);
    if (this.connectingPromise) return this.connectingPromise;

    const connString = process.env['MONGODB_CLOUD_STRING'];
    if (!connString) return Promise.resolve(null);

    this.connectingPromise = (async () => {
      try {
        this.client = new MongoClient(connString);
        await this.client.connect();
        const db = this.client.db('clothos_motor');
        const col = db.collection<QueryRefDoc>('query_refs');

        await col.createIndex({ correlationId: 1 }, { unique: true });
        await col.createIndex({ tenantId: 1, createdAt: -1 });
        await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 }); // TTL 1 ano

        this.collection = col;
        return col;
      } catch (err) {
        logger.error({ err }, 'MongoQueryRefStore: connection failed');
        return null;
      } finally {
        this.connectingPromise = null;
      }
    })();

    return this.connectingPromise;
  }

  /**
   * Persiste referência de pesquisa em MongoDB.
   * Operação fire-and-forget: não aguarda conclusão.
   *
   * @param {QueryRefDoc} ref - Referência com correlationId, tenantId, gateway, fonte
   */
  save(ref: QueryRefDoc): void {
    this.connect()
      .then((col) => {
        if (!col) return;
        col.insertOne(ref).catch((err) => {
          logger.error({ err, correlationId: ref.correlationId }, 'MongoQueryRefStore: insertOne failed');
        });
      })
      .catch((err) => {
        logger.error({ err }, 'MongoQueryRefStore: save failed');
      });
  }
}
