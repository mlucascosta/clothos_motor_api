/**
 * @fileoverview Global setup para testes de integração PostgreSQL.
 * Aplica o schema (idempotente) via node-postgres antes de qualquer teste.
 * Falha explicitamente se DATABASE_URL não estiver configurado — testes de integração
 * EXIGEM banco real (política do projeto: nunca mockar o banco).
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

const ROOT = join(__dirname, '..', '..', '..', 'db');

function readSql(relPath: string): string {
  return readFileSync(join(ROOT, relPath), 'utf-8');
}

export default async function globalSetup(): Promise<void> {
  const url = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'];

  if (!url) {
    throw new Error(
      '[integration-tests] DATABASE_URL não definida.\n' +
        'Testes de integração exigem banco real (política: nunca mockar o banco).\n' +
        'Defina DATABASE_URL no ambiente antes de executar: rtk pnpm test:integration',
    );
  }

  const pool = new Pool({ connectionString: url });

  try {
    // Aplica migrations na ordem correta — todas idempotentes
    const migrations = [
      'migrations/0001_core_schema.sql',
      'migrations/0002_indexes_optimization.sql',
      'migrations/0003_autovacuum_tuning.sql',
      'migrations/0004_maintenance.sql',
      'migrations/0005_job_claim_leases.sql',
      'migrations/0006_finder_progressive_planning.sql',
      'seeds/providers.sql',
    ];

    for (const migration of migrations) {
      const sql = readSql(migration);
      await pool.query(sql);
    }

    console.info('[integration-tests] Schema aplicado com sucesso.');
  } finally {
    await pool.end();
  }
}
