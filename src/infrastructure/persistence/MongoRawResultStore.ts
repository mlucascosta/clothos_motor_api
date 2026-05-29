/**
 * @fileoverview Persistência de respostas brutas de provedores em MongoDB.
 * Armazena respostas raw (antes de transformação) para auditoria, debugging e reprocessamento.
 * CPF em documentos é hash SHA-256; CNPJ é armazenado em texto claro (dado público).
 * @module infrastructure/persistence/MongoRawResultStore
 */

import { type Collection, MongoClient } from 'mongodb';
import type { IRawResultStore } from './IRawResultStore.js';
import type { RawResultDoc } from './RawResultDoc.js';
import { hashCpfIfNeeded } from '../../shared/domain/privacy/hashCpf.js';

/**
 * Store de resultados brutos em MongoDB.
 * Implementa padrão singleton com lazy connection.
 * Responsabilidades:
 * - Conexão à coleção `raw_results` em BD `clothos_motor`
 * - Índices para queries por gateway, tipo_param, status
 * - Hashing de CPF (LGPD: não armazenar em texto claro)
 *
 * @class MongoRawResultStore
 */
export class MongoRawResultStore implements IRawResultStore {
  /** @type {MongoClient | null} Cliente MongoDB (singleton) */
  private client: MongoClient | null = null;
  /** @type {Collection<RawResultDoc> | null} Collection raw_results */
  private collection: Collection<RawResultDoc> | null = null;
  /** @type {Promise<Collection<RawResultDoc> | null> | null} Promise compartilhada durante conexão */
  private connectingPromise: Promise<Collection<RawResultDoc> | null> | null = null;

  /**
   * Conecta ao MongoDB na primeira chamada (lazy singleton).
   * Cria índices na collection se conexão bem-sucedida.
   * Se já conectado, retorna collection existente.
   * Se conectando, aguarda a mesma Promise em vez de descartar.
   *
   * @async
   * @private
   * @returns {Promise<Collection<RawResultDoc> | null>} Collection pronta ou null em falha/desabilitado
   */
  private connect(): Promise<Collection<RawResultDoc> | null> {
    if (this.collection) return Promise.resolve(this.collection);
    if (this.connectingPromise) return this.connectingPromise;

    const connString = process.env['MONGODB_CLOUD_STRING'];
    if (!connString) return Promise.resolve(null);

    this.connectingPromise = (async () => {
      try {
        this.client = new MongoClient(connString);
        await this.client.connect();
        const db = this.client.db('clothos_motor');
        const col = db.collection<RawResultDoc>('raw_results');

        await col.createIndex({ gateway: 1, created_at: -1 });
        await col.createIndex({ tipo_param: 1, param: 1, created_at: -1 });
        await col.createIndex({ status: 1, created_at: -1 });

        this.collection = col;
        return col;
      } catch (err) {
        console.error('[MongoRawResultStore] connection failed:', err);
        return null;
      } finally {
        this.connectingPromise = null;
      }
    })();

    return this.connectingPromise;
  }

  /**
   * Persiste documento de resultado bruto em MongoDB.
   * Operação fire-and-forget: não aguarda conclusão (async no background).
   * CPF é hash antes da persistência.
   *
   * @param {RawResultDoc} doc - Documento com gateway, fonte, param, result, status, etc.
   * @returns {void} Não retorna; persiste no background
   */
  save(doc: RawResultDoc): void {
    const safeDoc: RawResultDoc = {
      ...doc,
      param: hashCpfIfNeeded(doc.tipo_param, doc.param),
    };

    this.connect()
      .then((col) => {
        if (!col) return;
        col.insertOne(safeDoc).catch((err) => {
          console.error('[MongoRawResultStore] insertOne failed:', err);
        });
      })
      .catch((err) => {
        console.error('[MongoRawResultStore] save failed:', err);
      });
  }
}
