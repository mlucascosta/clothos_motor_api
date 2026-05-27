import { createHash } from 'node:crypto';
import { MongoClient, type Collection } from 'mongodb';
import type { RawResultDoc } from './RawResultDoc.js';

export class MongoRawResultStore {
  private client: MongoClient | null = null;
  private collection: Collection<RawResultDoc> | null = null;
  private connecting = false;

  private maybeHashCpf(tipoParam: string | null, param: string | null): string | null {
    if (tipoParam === 'cpf_cnpj' && param !== null && /^\d{11}$/.test(param.replace(/\D/g, ''))) {
      return createHash('sha256').update(param.replace(/\D/g, '')).digest('hex');
    }
    return param;
  }

  private async connect(): Promise<Collection<RawResultDoc> | null> {
    if (this.collection) return this.collection;
    if (this.connecting) return null;

    const connString = process.env['MONGODB_CLOUD_STRING'];
    if (!connString) return null;

    this.connecting = true;
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
      this.connecting = false;
      return null;
    }
  }

  save(doc: RawResultDoc): void {
    const safeDoc: RawResultDoc = {
      ...doc,
      param: this.maybeHashCpf(doc.tipo_param, doc.param),
    };

    this.connect().then((col) => {
      if (!col) return;
      col.insertOne(safeDoc).catch((err) => {
        console.error('[MongoRawResultStore] insertOne failed:', err);
      });
    }).catch((err) => {
      console.error('[MongoRawResultStore] save failed:', err);
    });
  }
}
