/**
 * @fileoverview Pool PostgreSQL singleton para o motor CLOTHOS.
 * Conecta exclusivamente ao banco reduto_core (ADR-0019: single-store PostgreSQL).
 *
 * Comportamento de ausência de banco:
 *   Se DATABASE_URL / MOTOR_DATABASE_URL não estiver configurado, `getPool()` retorna null.
 *   Os stores (PgRawResultStore, PgQueryRefStore) tratam null como no-op, preservando o
 *   comportamento do MongoRawResultStore/MongoQueryRefStore anterior: sem banco configurado,
 *   a persistência é silenciada sem quebrar os testes de provider.
 *
 * @module infrastructure/database/pool
 */

import { logger } from '@shared/infrastructure/logger.js';
import { Pool } from 'pg';

/** Pool singleton lazy — null enquanto DATABASE_URL não estiver disponível. */
let _pool: Pool | null = null;

/**
 * Retorna o pool singleton PostgreSQL, criando na primeira chamada (lazy).
 * Se nenhuma URL de banco estiver configurada, retorna null (no-op para os stores).
 *
 * Lê em ordem: `DATABASE_URL` → `MOTOR_DATABASE_URL`.
 *
 * @returns {Pool | null} Pool pronto ou null quando banco não configurado
 */
export function getPool(): Pool | null {
  if (_pool !== null) return _pool;

  const url = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'];
  if (!url) return null;

  _pool = new Pool({
    connectionString: url,
    // Garante que cada conexão não herda search_path de sessão anterior.
    // O motor NÃO é multi-tenant — apenas reduto_core é acessado (ADR-0019).
    options: '-c search_path=reduto_core,public',
  });

  _pool.on('error', (err) => {
    logger.error({ err }, 'pg.pool: idle client error');
  });

  return _pool;
}

/**
 * Drena e fecha o pool (usado em teardown de testes ou shutdown gracioso).
 *
 * @returns {Promise<void>}
 */
export async function closePool(): Promise<void> {
  if (_pool === null) return;
  const p = _pool;
  _pool = null;
  await p.end();
}
