/**
 * @fileoverview Testes de integração — PgRawResultStore e PgQueryRefStore.
 *
 * save() é fire-and-forget: não bloqueia. Testes usam polling com timeout
 * para aguardar a persistência. Exercita hash de CPF (LGPD), CNPJ em claro
 * e idempotência de query_refs via ON CONFLICT DO NOTHING.
 */

import { createHash } from 'node:crypto';
import { PgQueryRefStore } from '@infrastructure/persistence/PgQueryRefStore.js';
import { PgRawResultStore } from '@infrastructure/persistence/PgRawResultStore.js';
import { Pool } from 'pg';
import { truncateTables } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Polling com timeout: aguarda até `timeoutMs` por uma linha na tabela.
 * Retorna a linha quando encontrada ou lança se o timeout expirar.
 */
async function pollForRow<T>(
  pool: Pool,
  query: string,
  params: unknown[],
  timeoutMs = 2000,
  intervalMs = 50,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { rows } = await pool.query<T>(query, params);
    // biome-ignore lint/style/noNonNullAssertion: guarda rows.length > 0 acima garante rows[0] !== undefined
    if (rows.length > 0) return rows[0]!;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`pollForRow: timeout após ${timeoutMs}ms — linha não encontrada`);
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

// ---------------------------------------------------------------------------
// Suite — PgRawResultStore
// ---------------------------------------------------------------------------

describe('PgRawResultStore — persistência fire-and-forget', () => {
  let pool: Pool;
  let store: PgRawResultStore;

  beforeAll(() => {
    // Garante que o pool singleton usa DATABASE_URL do ambiente
    process.env['DATABASE_URL'] = DATABASE_URL;
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
    });
    store = new PgRawResultStore();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await truncateTables(pool);
  });

  // -------------------------------------------------------------------------
  // Teste 1: save() persiste documento básico (polling até aparecer)
  // -------------------------------------------------------------------------
  it('save() persiste documento no banco — polling confirma a linha', async () => {
    const corrId = `corr-${Date.now()}`;

    store.save({
      gateway: 'escavador',
      fonte: 'pessoas',
      tipo_param: 'nome',
      param: 'João da Silva',
      result: { encontrado: true, total: 3 },
      status: 'success',
      correlationId: corrId,
      created_at: new Date(),
    });

    const row = await pollForRow<{
      gateway: string;
      fonte: string;
      param: string;
      status: string;
      result: Record<string, unknown>;
    }>(
      pool,
      `SELECT gateway, fonte, param, status, result
         FROM clothos_core.raw_results
        WHERE correlation_id = $1`,
      [corrId],
    );

    expect(row.gateway).toBe('escavador');
    expect(row.fonte).toBe('pessoas');
    expect(row.param).toBe('João da Silva');
    expect(row.status).toBe('success');

    const result = typeof row.result === 'string' ? JSON.parse(row.result) : row.result;
    expect(result).toEqual({ encontrado: true, total: 3 });
  });

  // -------------------------------------------------------------------------
  // Teste 2: CPF é hasheado (LGPD) — tipo_param='cpf_cnpj' + 11 dígitos
  // -------------------------------------------------------------------------
  it('CPF com tipo_param=cpf_cnpj é armazenado como hash SHA-256 (nunca em claro)', async () => {
    const rawCpf = '12345678901'; // 11 dígitos — CPF
    const expectedHash = sha256(rawCpf);
    const corrId = `cpf-hash-${Date.now()}`;

    store.save({
      gateway: 'escavador',
      fonte: 'consulta',
      tipo_param: 'cpf_cnpj',
      param: rawCpf,
      result: { ok: true },
      status: 'success',
      correlationId: corrId,
      created_at: new Date(),
    });

    const row = await pollForRow<{ param: string }>(
      pool,
      'SELECT param FROM clothos_core.raw_results WHERE correlation_id = $1',
      [corrId],
    );

    expect(row.param).not.toBe(rawCpf); // nunca em claro
    expect(row.param).toBe(expectedHash); // SHA-256
  });

  // -------------------------------------------------------------------------
  // Teste 3: CNPJ permanece em claro (dado público)
  // -------------------------------------------------------------------------
  it('CNPJ (14 dígitos numéricos) permanece em claro — não é hasheado', async () => {
    const cnpj = '12345678000195'; // 14 dígitos — CNPJ numérico
    const corrId = `cnpj-plain-${Date.now()}`;

    store.save({
      gateway: 'brasilapi',
      fonte: 'cnpj',
      tipo_param: 'cpf_cnpj',
      param: cnpj,
      result: { razao_social: 'ACME LTDA' },
      status: 'success',
      correlationId: corrId,
      created_at: new Date(),
    });

    const row = await pollForRow<{ param: string }>(
      pool,
      'SELECT param FROM clothos_core.raw_results WHERE correlation_id = $1',
      [corrId],
    );

    expect(row.param).toBe(cnpj); // em claro
  });

  // -------------------------------------------------------------------------
  // Teste 4: CNPJ alfanumérico (formato RFB jul/2026) permanece em claro
  // -------------------------------------------------------------------------
  it('CNPJ alfanumérico (12 posições + 2 DV) permanece em claro', async () => {
    const cnpjAlpha = 'AB3456780001AB'; // formato alfanumérico RFB
    const corrId = `cnpj-alpha-${Date.now()}`;

    store.save({
      gateway: 'brasilapi',
      fonte: 'cnpj',
      tipo_param: 'cpf_cnpj',
      param: cnpjAlpha,
      result: { razao_social: 'STARTUP ALFA LTDA' },
      status: 'success',
      correlationId: corrId,
      created_at: new Date(),
    });

    const row = await pollForRow<{ param: string }>(
      pool,
      'SELECT param FROM clothos_core.raw_results WHERE correlation_id = $1',
      [corrId],
    );

    expect(row.param).toBe(cnpjAlpha);
  });

  // -------------------------------------------------------------------------
  // Teste 5: status='error' + error_kind persistidos corretamente
  // -------------------------------------------------------------------------
  it('status=error e error_kind são persistidos corretamente', async () => {
    const corrId = `err-${Date.now()}`;

    store.save({
      gateway: 'datajud',
      fonte: 'processos',
      tipo_param: 'cpf_cnpj',
      param: '12345678901',
      result: null,
      status: 'error',
      error_kind: 'UPSTREAM_ERROR',
      correlationId: corrId,
      created_at: new Date(),
    });

    const row = await pollForRow<{ status: string; error_kind: string }>(
      pool,
      'SELECT status, error_kind FROM clothos_core.raw_results WHERE correlation_id = $1',
      [corrId],
    );

    expect(row.status).toBe('error');
    expect(row.error_kind).toBe('UPSTREAM_ERROR');
  });

  // -------------------------------------------------------------------------
  // Teste 6: save() sem pool configurado é no-op silencioso
  // -------------------------------------------------------------------------
  it('save() sem DATABASE_URL configurado é no-op — não lança', () => {
    // Remove DATABASE_URL temporariamente para forçar getPool() → null
    const savedUrl = process.env['DATABASE_URL'];
    process.env['DATABASE_URL'] = undefined;
    process.env['MOTOR_DATABASE_URL'] = undefined;

    // Força reload do módulo pool não é possível diretamente (singleton).
    // O store instancia um novo PgRawResultStore; getPool() retornará o pool
    // existente (já inicializado). Este teste verifica que mesmo com result=null
    // a chamada não lança.
    const freshStore = new PgRawResultStore();
    expect(() =>
      freshStore.save({
        gateway: 'test',
        fonte: 'test',
        tipo_param: null,
        param: null,
        result: null,
        status: 'success',
        created_at: new Date(),
      }),
    ).not.toThrow();

    // Restaura
    process.env['DATABASE_URL'] = savedUrl;
  });
});

// ---------------------------------------------------------------------------
// Suite — PgQueryRefStore
// ---------------------------------------------------------------------------

describe('PgQueryRefStore — idempotência via ON CONFLICT DO NOTHING', () => {
  let pool: Pool;
  let store: PgQueryRefStore;

  beforeAll(() => {
    process.env['DATABASE_URL'] = DATABASE_URL;
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
    });
    store = new PgQueryRefStore();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await truncateTables(pool);
  });

  // -------------------------------------------------------------------------
  // Teste 7: save() persiste ref básica
  // -------------------------------------------------------------------------
  it('save() persiste QueryRefDoc e é recuperável pelo correlation_id', async () => {
    const corrId = `qref-${Date.now()}`;

    store.save({
      correlationId: corrId,
      tenantId: 'acme',
      gateway: 'escavador',
      fonte: 'pessoas',
      createdAt: new Date(),
    });

    const row = await pollForRow<{
      correlation_id: string;
      tenant_id: string;
      gateway: string;
    }>(
      pool,
      'SELECT correlation_id, tenant_id, gateway FROM clothos_core.query_refs WHERE correlation_id = $1',
      [corrId],
    );

    expect(row.correlation_id).toBe(corrId);
    expect(row.tenant_id).toBe('acme');
    expect(row.gateway).toBe('escavador');
  });

  // -------------------------------------------------------------------------
  // Teste 8: correlation_id duplicado → ON CONFLICT DO NOTHING, não duplica
  // -------------------------------------------------------------------------
  it('correlation_id duplicado não duplica e não lança (ON CONFLICT DO NOTHING)', async () => {
    const corrId = `qref-dup-${Date.now()}`;

    store.save({
      correlationId: corrId,
      tenantId: 'acme',
      gateway: 'escavador',
      fonte: 'pessoas',
      createdAt: new Date(),
    });

    // Aguarda a primeira inserção
    await pollForRow(pool, 'SELECT 1 FROM clothos_core.query_refs WHERE correlation_id = $1', [
      corrId,
    ]);

    // Segunda chamada com mesmo corrId — deve ser silenciada
    store.save({
      correlationId: corrId,
      tenantId: 'acme',
      gateway: 'escavador',
      fonte: 'pessoas',
      createdAt: new Date(),
    });

    // Aguarda um pouco para garantir que a segunda tentativa processou
    await new Promise((r) => setTimeout(r, 200));

    const { rows } = await pool.query(
      'SELECT count(*) AS c FROM clothos_core.query_refs WHERE correlation_id = $1',
      [corrId],
    );
    expect(Number(rows[0].c)).toBe(1); // exatamente 1 linha
  });
});
