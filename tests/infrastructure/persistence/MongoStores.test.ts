/**
 * @fileoverview Testes dos stores de persistência MongoDB (raw_results + query_refs).
 * Mocka o driver `mongodb` para exercitar conexão lazy, hashing de CPF (LGPD),
 * singleton de conexão e captura de erro do insertOne sem MongoDB real.
 * @module tests/infrastructure/persistence/MongoStores
 */

import { createHash } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { MongoQueryRefStore } from '../../../src/infrastructure/persistence/MongoQueryRefStore';
import { MongoRawResultStore } from '../../../src/infrastructure/persistence/MongoRawResultStore';
import type { QueryRefDoc } from '../../../src/infrastructure/persistence/QueryRefDoc';
import type { RawResultDoc } from '../../../src/infrastructure/persistence/RawResultDoc';

const mockConnect = jest.fn();
const mockCreateIndex = jest.fn();
const mockInsertOne = jest.fn();
const mockCollection = jest.fn();
const mockDb = jest.fn();

jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    db: mockDb,
  })),
}));

/** Drena a fila de microtasks/macrotasks para o save() fire-and-forget concluir. */
async function flush(): Promise<void> {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}

const CONN = 'mongodb://localhost:27017/clothos_motor';

beforeEach(() => {
  jest.clearAllMocks();
  mockConnect.mockResolvedValue(undefined);
  mockCreateIndex.mockResolvedValue('idx');
  mockInsertOne.mockResolvedValue({ acknowledged: true });
  mockCollection.mockReturnValue({ createIndex: mockCreateIndex, insertOne: mockInsertOne });
  mockDb.mockReturnValue({ collection: mockCollection });
  process.env['MONGODB_CLOUD_STRING'] = CONN;
});

afterEach(() => {
  process.env['MONGODB_CLOUD_STRING'] = '';
});

function rawDoc(overrides: Partial<RawResultDoc> = {}): RawResultDoc {
  return {
    gateway: 'directdata',
    fonte: 'cadastro_pessoa_fisica',
    tipo_param: 'cpf_cnpj',
    param: '12345678901',
    result: { ok: true },
    status: 'success',
    created_at: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

describe('MongoRawResultStore', () => {
  it('não conecta nem insere quando MONGODB_CLOUD_STRING está ausente', async () => {
    process.env['MONGODB_CLOUD_STRING'] = '';
    const store = new MongoRawResultStore();

    store.save(rawDoc());
    await flush();

    expect(MongoClient as unknown as jest.Mock).not.toHaveBeenCalled();
    expect(mockInsertOne).not.toHaveBeenCalled();
  });

  it('persiste CPF como hash SHA-256 (LGPD), nunca em texto claro', async () => {
    const store = new MongoRawResultStore();
    const plaintext = '12345678901';
    const expectedHash = createHash('sha256').update(plaintext).digest('hex');

    store.save(rawDoc({ tipo_param: 'cpf_cnpj', param: plaintext }));
    await flush();

    expect(mockInsertOne).toHaveBeenCalledTimes(1);
    const persisted = mockInsertOne.mock.calls[0][0] as RawResultDoc;
    expect(persisted.param).toBe(expectedHash);
    expect(persisted.param).not.toBe(plaintext);
    expect(persisted.param).toHaveLength(64);
  });

  it('mantém CNPJ (14 dígitos) em texto claro — dado público', async () => {
    const store = new MongoRawResultStore();
    const cnpj = '11222333000181';

    store.save(rawDoc({ tipo_param: 'cpf_cnpj', param: cnpj }));
    await flush();

    const persisted = mockInsertOne.mock.calls[0][0] as RawResultDoc;
    expect(persisted.param).toBe(cnpj);
  });

  it('insere na collection raw_results do banco clothos_motor', async () => {
    const store = new MongoRawResultStore();

    store.save(rawDoc());
    await flush();

    expect(mockDb).toHaveBeenCalledWith('clothos_motor');
    expect(mockCollection).toHaveBeenCalledWith('raw_results');
  });

  it('reaproveita a conexão (singleton) entre múltiplos saves', async () => {
    const store = new MongoRawResultStore();

    store.save(rawDoc({ param: '11122233344' }));
    await flush();
    store.save(rawDoc({ param: '55566677788' }));
    await flush();

    expect(MongoClient as unknown as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockInsertOne).toHaveBeenCalledTimes(2);
  });

  it('não propaga exceção quando insertOne rejeita', async () => {
    mockInsertOne.mockRejectedValueOnce(new Error('write failed'));
    const store = new MongoRawResultStore();

    expect(() => store.save(rawDoc())).not.toThrow();
    await flush();

    expect(mockInsertOne).toHaveBeenCalledTimes(1);
  });

  it('não propaga exceção quando a conexão falha', async () => {
    mockConnect.mockRejectedValueOnce(new Error('connection refused'));
    const store = new MongoRawResultStore();

    expect(() => store.save(rawDoc())).not.toThrow();
    await flush();

    expect(mockInsertOne).not.toHaveBeenCalled();
  });
});

describe('MongoQueryRefStore', () => {
  function queryRef(overrides: Partial<QueryRefDoc> = {}): QueryRefDoc {
    return {
      correlationId: 'corr-123',
      tenantId: 'tenant-acme',
      gateway: 'directdata',
      fonte: 'cadastro_pessoa_fisica',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      ...overrides,
    };
  }

  it('não conecta nem insere quando MONGODB_CLOUD_STRING está ausente', async () => {
    process.env['MONGODB_CLOUD_STRING'] = '';
    const store = new MongoQueryRefStore();

    store.save(queryRef());
    await flush();

    expect(mockInsertOne).not.toHaveBeenCalled();
  });

  it('persiste a referência na collection query_refs', async () => {
    const store = new MongoQueryRefStore();
    const ref = queryRef();

    store.save(ref);
    await flush();

    expect(mockDb).toHaveBeenCalledWith('clothos_motor');
    expect(mockCollection).toHaveBeenCalledWith('query_refs');
    expect(mockInsertOne).toHaveBeenCalledWith(ref);
  });

  it('reaproveita a conexão (singleton) entre múltiplos saves', async () => {
    const store = new MongoQueryRefStore();

    store.save(queryRef({ correlationId: 'a' }));
    await flush();
    store.save(queryRef({ correlationId: 'b' }));
    await flush();

    expect(MongoClient as unknown as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockInsertOne).toHaveBeenCalledTimes(2);
  });

  it('não propaga exceção quando insertOne rejeita', async () => {
    mockInsertOne.mockRejectedValueOnce(new Error('duplicate key'));
    const store = new MongoQueryRefStore();

    expect(() => store.save(queryRef())).not.toThrow();
    await flush();

    expect(mockInsertOne).toHaveBeenCalledTimes(1);
  });
});
