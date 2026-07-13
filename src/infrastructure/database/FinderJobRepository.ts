import type { FinderArtifact } from '@application/finder/contracts.js';
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
         (job_id, source_id, stage, candidate_id, status, started_at)
       VALUES ($1, $2, $3, $4, 'started', now())
       ON CONFLICT (job_id, source_id, candidate_id)
       DO UPDATE SET status = 'started', error_kind = NULL, started_at = now(), completed_at = NULL
       RETURNING id`,
      [input.jobId, input.sourceId, input.stage, input.candidateId ?? ''],
    );
    return Number(rows[0]?.id);
  }

  async completeSourceExecution(id: number): Promise<void> {
    await this.pool.query(
      `UPDATE clothos_core.job_source_executions
          SET status = 'completed', completed_at = now()
        WHERE id = $1`,
      [id],
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
