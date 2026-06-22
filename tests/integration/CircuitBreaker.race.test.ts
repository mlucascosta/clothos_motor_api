/**
 * @fileoverview Testes de integração — CircuitBreaker com pg_advisory_xact_lock.
 *
 * Prova que recordFailure() concorrente não perde atualizações (sem lost update)
 * graças ao advisory lock, que recordSuccess() em half_open fecha o circuito,
 * e que a janela deslizante filtra falhas antigas.
 */

import { CircuitBreaker } from '@infrastructure/circuit-breaker/CircuitBreaker.js';
import { Pool } from 'pg';
import { resetCircuitBreaker } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

const TEST_SLUG = 'escavador'; // provider que existe no seed

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('CircuitBreaker — concorrência e advisory lock', () => {
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
      max: 20, // pool maior para suportar concorrência
    });
  });

  afterAll(async () => {
    await resetCircuitBreaker(pool, TEST_SLUG);
    await pool.end();
  });

  beforeEach(async () => {
    await resetCircuitBreaker(pool, TEST_SLUG);
  });

  // Helper: lê o estado JSONB diretamente do banco
  async function readRawState(slug: string) {
    const { rows } = await pool.query<{ circuit_breaker_state: Record<string, unknown> }>(
      'SELECT circuit_breaker_state FROM clothos_core.providers WHERE slug = $1',
      [slug],
    );
    return rows[0]?.circuit_breaker_state ?? null;
  }

  // -------------------------------------------------------------------------
  // Teste 1: threshold=5 recordFailures CONCORRENTES — nenhum lost update
  // -------------------------------------------------------------------------
  it('5 recordFailure() concorrentes registram TODAS as falhas — sem lost update (advisory lock)', async () => {
    const THRESHOLD = 5;
    const cb = new CircuitBreaker(pool, TEST_SLUG, {
      threshold: THRESHOLD,
      windowSec: 300,
      openDurationSec: 300,
    });

    // Estado inicial: fechado, sem falhas
    expect(await cb.isOpen()).toBe(false);

    // Act: dispara exatamente threshold falhas concorrentes
    await Promise.all(Array.from({ length: THRESHOLD }, () => cb.recordFailure()));

    // Assert: circuito deve estar aberto
    const stateAfter = await readRawState(TEST_SLUG);
    expect(stateAfter).not.toBeNull();
    expect(stateAfter?.['state']).toBe('open');

    // Todas as 5 falhas foram registradas (sem lost update)
    const failures = stateAfter?.['failures'] as number[];
    expect(failures.length).toBeGreaterThanOrEqual(THRESHOLD);

    expect(await cb.isOpen()).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Teste 2: mais falhas que threshold — circuito abre e permanece aberto
  // -------------------------------------------------------------------------
  it('8 recordFailure() com threshold=5 — circuito abre após 5ª falha', async () => {
    const cb = new CircuitBreaker(pool, TEST_SLUG, {
      threshold: 5,
      windowSec: 300,
      openDurationSec: 300,
    });

    await Promise.all(Array.from({ length: 8 }, () => cb.recordFailure()));

    expect(await cb.isOpen()).toBe(true);
    const state = await readRawState(TEST_SLUG);
    expect(state?.['state']).toBe('open');
  });

  // -------------------------------------------------------------------------
  // Teste 3: recordSuccess() em half_open fecha o circuito
  // -------------------------------------------------------------------------
  it('recordSuccess() em estado half_open fecha o circuito (reset total)', async () => {
    // Força estado half_open diretamente no banco
    await pool.query(
      `UPDATE clothos_core.providers
          SET circuit_breaker_state = '{"state":"half_open","opened_at":0,"failures":[1,2,3,4,5]}'::jsonb,
              updated_at = now()
        WHERE slug = $1`,
      [TEST_SLUG],
    );

    const cb = new CircuitBreaker(pool, TEST_SLUG, {
      threshold: 5,
      windowSec: 300,
      openDurationSec: 300,
    });

    await cb.recordSuccess();

    const state = await readRawState(TEST_SLUG);
    expect(state?.['state']).toBe('closed');
    expect(state?.['failures']).toEqual([]);
    expect(state?.['opened_at']).toBe(0);
    expect(await cb.isOpen()).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Teste 4: recordSuccess() em estado closed — no-op (não altera)
  // -------------------------------------------------------------------------
  it('recordSuccess() em estado closed é no-op', async () => {
    const cb = new CircuitBreaker(pool, TEST_SLUG, {
      threshold: 5,
      windowSec: 300,
      openDurationSec: 300,
    });

    // Adiciona 2 falhas (abaixo do threshold)
    await cb.recordFailure();
    await cb.recordFailure();

    const before = await readRawState(TEST_SLUG);

    await cb.recordSuccess(); // no-op — estado é 'closed', não 'half_open'

    const after = await readRawState(TEST_SLUG);
    // Estado não muda
    expect(after?.['state']).toBe('closed');
    expect((after?.['failures'] as number[]).length).toBe(
      (before?.['failures'] as number[]).length,
    );
  });

  // -------------------------------------------------------------------------
  // Teste 5: janela deslizante — falhas antigas não contam
  // -------------------------------------------------------------------------
  it('falhas fora da janela (timestamps antigos no JSONB) não contam para o threshold', async () => {
    const THRESHOLD = 5;
    const WINDOW_SEC = 60; // janela de 60s para este teste

    const nowMs = Date.now();
    // 4 falhas antigas (2 minutos atrás, fora da janela de 60s)
    const oldFailures = [nowMs - 120_000, nowMs - 115_000, nowMs - 110_000, nowMs - 105_000];

    // Injeta estado com 4 falhas antigas diretamente (simulando janela passada)
    await pool.query(
      `UPDATE clothos_core.providers
          SET circuit_breaker_state = jsonb_build_object(
            'state', 'closed',
            'opened_at', 0,
            'failures', $1::jsonb
          ),
          updated_at = now()
        WHERE slug = $2`,
      [JSON.stringify(oldFailures), TEST_SLUG],
    );

    const cb = new CircuitBreaker(pool, TEST_SLUG, {
      threshold: THRESHOLD,
      windowSec: WINDOW_SEC,
      openDurationSec: 300,
    });

    // Adiciona 1 falha nova (dentro da janela)
    // Total na janela = 1 (as 4 antigas foram filtradas) → threshold=5 NÃO é atingido
    await cb.recordFailure();

    const state = await readRawState(TEST_SLUG);
    expect(state?.['state']).toBe('closed'); // circuito permanece fechado
    expect(await cb.isOpen()).toBe(false);

    // O array de failures deve conter apenas as falhas dentro da janela (≤1)
    const failures = state?.['failures'] as number[];
    expect(failures.length).toBeLessThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // Teste 6: isOpen() transita open→half_open quando openDurationSec expirou
  // -------------------------------------------------------------------------
  it('isOpen() transita open→half_open quando o tempo de abertura expirou', async () => {
    const OPEN_DURATION_SEC = 1; // 1s para expirar rapidamente no teste

    // Força estado open com opened_at no passado (2s atrás)
    const openedAtMs = Date.now() - 2000;
    await pool.query(
      `UPDATE clothos_core.providers
          SET circuit_breaker_state = jsonb_build_object(
            'state', 'open',
            'opened_at', $1::bigint,
            'failures', '[]'::jsonb
          ),
          updated_at = now()
        WHERE slug = $2`,
      [openedAtMs, TEST_SLUG],
    );

    const cb = new CircuitBreaker(pool, TEST_SLUG, {
      threshold: 5,
      windowSec: 300,
      openDurationSec: OPEN_DURATION_SEC,
    });

    // isOpen() deve transitar para half_open e retornar false (permite sondagem)
    const result = await cb.isOpen();
    expect(result).toBe(false);

    const state = await readRawState(TEST_SLUG);
    expect(state?.['state']).toBe('half_open');
  });
});
