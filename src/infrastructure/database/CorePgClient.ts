/**
 * @fileoverview Cliente PostgreSQL do motor para o schema clothos_core.
 *
 * INVARIANTE — Motor não é multi-tenant (ADR-0019):
 *   O motor conecta APENAS ao banco clothos_core. Nunca executa `SET search_path`
 *   para schema de tenant nem interpola `tenant_slug` em SQL. O `tenant_slug`
 *   presente nas linhas de `jobs` é exclusivamente um rótulo de correlação/auditoria.
 *
 *   A validação de schema tenant e o `SET search_path TO tenant_{slug}` vivem
 *   exclusivamente no app Laravel (middleware `SetTenantSchema`), onde o resultado
 *   refinado é persistido em `clothos_results.tenant_{slug}`.
 *
 * @module infrastructure/database/CorePgClient
 */

import type { Pool, PoolClient } from 'pg';

/**
 * Wrapper sobre o pool de conexões PostgreSQL que expõe acesso controlado
 * ao schema `clothos_core`.
 *
 * @example
 * const client = new CorePgClient(pool);
 * const rows = await client.withClient((c) =>
 *   c.query('SELECT id FROM clothos_core.jobs WHERE status = $1', ['pending'])
 * );
 */
export class CorePgClient {
  /**
   * @param {Pool} pool - Pool pg apontando para clothos_core (tipicamente via PgBouncer).
   *   Sem SET search_path por tenant — motor não é multi-tenant (ADR-0019).
   */
  constructor(private readonly pool: Pool) {}

  /**
   * Executa `fn` com um cliente do pool, garantindo release mesmo em caso de erro.
   * Não inicia transação — use `withTransaction` para operações ACID.
   *
   * @template T Tipo do resultado retornado por `fn`
   * @param {(client: PoolClient) => Promise<T>} fn - Callback que recebe o cliente pronto
   * @returns {Promise<T>}
   */
  async withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }

  /**
   * Executa `fn` dentro de uma transação BEGIN/COMMIT.
   * Em caso de erro, faz ROLLBACK antes de relançar.
   * Garante release do cliente no bloco `finally`.
   *
   * @template T Tipo do resultado retornado por `fn`
   * @param {(client: PoolClient) => Promise<T>} fn - Callback transacional
   * @returns {Promise<T>}
   */
  async withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
