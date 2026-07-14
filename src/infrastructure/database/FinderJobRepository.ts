import type { FinderArtifact } from '@application/finder/contracts.js';
import { hashCpfIfNeeded } from '@shared/domain/privacy/hashCpf.js';
import type { Pool } from 'pg';

export type FinderJobEventType =
  | 'progress'
  | 'source_completed'
  | 'source_failed'
  | 'candidate_selection_required';

export interface SourceExecutionStart {
  jobId: string;
  sourceId: string;
  stage: number;
  candidateId?: string;
  /** Codigo comercial da fonte (Laravel exige NOT NULL); default = sourceId. */
  sourceCode?: string;
}

/** Resultado de cache gravado ao concluir a execucao de uma fonte. */
export interface SourceExecutionCompletion {
  cacheHit?: boolean;
  cacheKey?: string;
  rawResultId?: number | null;
}

/** Linha de auditoria bruta persistida no miss de cache. */
export interface RawResultInput {
  gateway: string;
  fonte: string;
  tipoParam: string | null;
  param: string | null;
  result: unknown;
  status: string;
  errorKind?: string | null;
  correlationId?: string | null;
  cacheKey: string;
}

/** Valor reutilizavel guardado no cache compartilhado. */
export interface CachedSourceResult {
  data: Record<string, unknown>;
  cost: number;
}

export interface StoredFinderArtifact extends FinderArtifact {
  jobId: string;
}

export class FinderJobRepository {
  constructor(private readonly pool: Pool) {}

  async appendEvent(
    jobId: string,
    type: FinderJobEventType,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT id FROM clothos_core.jobs WHERE job_id = $1 FOR UPDATE', [jobId]);
      const { rows } = await client.query<{ sequence: number }>(
        'SELECT COALESCE(MAX(sequence), 0) + 1 AS sequence FROM clothos_core.job_events WHERE job_id = $1',
        [jobId],
      );
      await client.query(
        `INSERT INTO clothos_core.job_events (job_id, sequence, event_type, payload)
         VALUES ($1, $2, $3, $4::jsonb)`,
        [jobId, rows[0]?.sequence ?? 1, type, JSON.stringify(payload)],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async startSourceExecution(input: SourceExecutionStart): Promise<number> {
    const { rows } = await this.pool.query<{ id: string }>(
      `INSERT INTO clothos_core.job_source_executions
         (job_id, source_id, source_code, stage, candidate_id, status, started_at)
       VALUES ($1, $2, $3, $4, $5, 'started', now())
       ON CONFLICT (job_id, source_id, candidate_id)
       DO UPDATE SET source_code = EXCLUDED.source_code, status = 'started',
                     error_kind = NULL, started_at = now(), completed_at = NULL,
                     cache_hit = FALSE, cache_key = NULL, raw_result_id = NULL
       RETURNING id`,
      [
        input.jobId,
        input.sourceId,
        input.sourceCode ?? input.sourceId,
        input.stage,
        input.candidateId ?? '',
      ],
    );
    return Number(rows[0]?.id);
  }

  async completeSourceExecution(
    id: number,
    completion: SourceExecutionCompletion = {},
  ): Promise<void> {
    await this.pool.query(
      `UPDATE clothos_core.job_source_executions
          SET status = 'completed', completed_at = now(),
              cache_hit = $2, cache_key = $3, raw_result_id = $4
        WHERE id = $1`,
      [
        id,
        completion.cacheHit ?? false,
        completion.cacheKey ?? null,
        completion.rawResultId ?? null,
      ],
    );
  }

  async failSourceExecution(id: number, errorKind: string): Promise<void> {
    await this.pool.query(
      `UPDATE clothos_core.job_source_executions
          SET status = 'failed', error_kind = $2, completed_at = now()
        WHERE id = $1`,
      [id, errorKind],
    );
  }

  /**
   * Consulta o cache compartilhado por chave opaca. Retorna o valor apenas se
   * ainda dentro do TTL (`expires_at > now()`); senao `null` (miss).
   */
  async lookupCache(cacheKey: string): Promise<CachedSourceResult | null> {
    const { rows } = await this.pool.query<{ value: CachedSourceResult }>(
      'SELECT value FROM clothos_core.cache WHERE key = $1 AND expires_at > now()',
      [cacheKey],
    );
    return rows[0]?.value ?? null;
  }

  /**
   * Grava (upsert) uma entrada de cache com TTL. `expires_at = now() + ttlSeconds`.
   * O chamador ja aplicou o teto de 7 dias.
   */
  async saveCache(cacheKey: string, value: CachedSourceResult, ttlSeconds: number): Promise<void> {
    await this.pool.query(
      `INSERT INTO clothos_core.cache (key, value, expires_at)
       VALUES ($1, $2::jsonb, now() + make_interval(secs => $3))
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, expires_at = EXCLUDED.expires_at`,
      [cacheKey, JSON.stringify(value), ttlSeconds],
    );
  }

  /**
   * Persiste a resposta bruta do provider (auditoria privada). CPF e hasheado
   * antes de gravar (LGPD); a linha e ligada ao cache por `cache_key`.
   */
  async saveRawResult(input: RawResultInput): Promise<number> {
    const { rows } = await this.pool.query<{ id: string }>(
      `INSERT INTO clothos_core.raw_results
         (gateway, fonte, tipo_param, param, result, status, error_kind, correlation_id, cache_key, created_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, now())
       RETURNING id`,
      [
        input.gateway,
        input.fonte,
        input.tipoParam,
        hashCpfIfNeeded(input.tipoParam, input.param),
        JSON.stringify(input.result),
        input.status,
        input.errorKind ?? null,
        input.correlationId ?? null,
        input.cacheKey,
      ],
    );
    return Number(rows[0]?.id);
  }

  async saveArtifact(artifact: StoredFinderArtifact): Promise<void> {
    await this.pool.query(
      `INSERT INTO clothos_core.derived_artifacts
         (job_id, artifact_key, value, provenance, source_execution_id)
       VALUES ($1, $2, $3::jsonb, $4::jsonb, $5)
       ON CONFLICT (job_id, artifact_key)
       DO UPDATE SET value = EXCLUDED.value, provenance = EXCLUDED.provenance,
                     source_execution_id = EXCLUDED.source_execution_id, updated_at = now()`,
      [
        artifact.jobId,
        artifact.key,
        JSON.stringify(artifact.value),
        JSON.stringify(artifact.provenance),
        artifact.provenance.sourceExecutionId,
      ],
    );
  }
}
