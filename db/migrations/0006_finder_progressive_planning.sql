-- =============================================================================
-- 0006_finder_progressive_planning.sql
-- Durable B1 progress records. All worker-to-app state remains in PostgreSQL.
-- =============================================================================

CREATE TABLE IF NOT EXISTS clothos_core.job_events (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id      UUID NOT NULL REFERENCES clothos_core.jobs(job_id) ON DELETE CASCADE,
  sequence    BIGINT NOT NULL CHECK (sequence > 0),
  event_type  SMALLINT NOT NULL CHECK (event_type BETWEEN 0 AND 3),  -- 0=progress 1=source_completed 2=source_failed 3=candidate_selection_required
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, sequence)
);

CREATE INDEX IF NOT EXISTS idx_job_events_job_sequence
  ON clothos_core.job_events (job_id, sequence);

CREATE TABLE IF NOT EXISTS clothos_core.job_source_executions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id        UUID NOT NULL REFERENCES clothos_core.jobs(job_id) ON DELETE CASCADE,
  source_id     TEXT NOT NULL,
  stage         SMALLINT NOT NULL CHECK (stage > 0),
  candidate_id  TEXT NOT NULL DEFAULT '',
  status        SMALLINT NOT NULL CHECK (status BETWEEN 0 AND 2),    -- 0=started 1=completed 2=failed
  error_kind    SMALLINT,   -- SourceErrorKind
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  UNIQUE (job_id, source_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_job_source_executions_job_stage
  ON clothos_core.job_source_executions (job_id, stage, id);

CREATE TABLE IF NOT EXISTS clothos_core.derived_artifacts (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id                UUID NOT NULL REFERENCES clothos_core.jobs(job_id) ON DELETE CASCADE,
  artifact_key          TEXT NOT NULL,
  value                 JSONB NOT NULL,
  provenance            JSONB NOT NULL,
  source_execution_id   BIGINT NOT NULL REFERENCES clothos_core.job_source_executions(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, artifact_key)
);

CREATE INDEX IF NOT EXISTS idx_derived_artifacts_job
  ON clothos_core.derived_artifacts (job_id, artifact_key);
