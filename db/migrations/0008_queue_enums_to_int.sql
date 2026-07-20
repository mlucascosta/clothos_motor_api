-- 0008 — Contrato da fila em enum NUMÉRICO (ADR-0024).
--
-- Espelha clothos_src/database/migrations/core/2026_07_14_000006_queue_enums_to_int.php.
-- O Laravel é o dono do schema `reduto_core` (G1); este arquivo é o bootstrap de DEV/TEST do
-- motor e precisa produzir exatamente o mesmo shape, senão a suíte de integração passa contra
-- um schema que não existe em lugar nenhum.
--
-- Os números são o protocolo: docs/enums/queue-contract.json (travado por teste nos dois lados).
--
-- Idempotente: só converte o que ainda for textual.

DO $$
DECLARE
  r RECORD;
BEGIN
  -- No-op em banco NOVO: as migrations 0001–0006 já nascem numéricas e a 0004 já cria as views
  -- e a archive_old_jobs() numéricas. Este arquivo existe apenas para converter um banco LEGADO
  -- (colunas ainda textuais). Sem este guard, ele derrubava as views que a 0004 acabara de criar.
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='jobs' AND column_name='status') <> 'text' THEN
    RETURN;
  END IF;

  -- Índices PARCIAIS carregam o literal no predicado (`WHERE status = 'pending'`). O Postgres
  -- tenta reconstruí-los ao trocar o tipo e falha. São o caminho quente do claim: precisam
  -- voltar com o predicado numérico, ou a fila perde o índice em silêncio e degrada sob carga.
  DROP INDEX IF EXISTS reduto_core.idx_jobs_claim;
  DROP INDEX IF EXISTS reduto_core.idx_jobs_queue_priority;
  DROP INDEX IF EXISTS reduto_core.idx_jobs_lease;
  DROP INDEX IF EXISTS reduto_core.idx_jobs_dlq;
  DROP INDEX IF EXISTS reduto_core.idx_jobs_claimed_stale;
  DROP INDEX IF EXISTS reduto_core.idx_jobs_claimed_lease_expires;
  DROP INDEX IF EXISTS reduto_core.jobs_history_claimed_at_idx;
  DROP INDEX IF EXISTS reduto_core.jobs_history_queue_priority_available_at_idx;
  DROP INDEX IF EXISTS reduto_core.jobs_history_updated_at_idx;

  -- As views operacionais também referenciam `status`/`queue` e travam o ALTER TYPE.
  -- Recriadas no fim — com RÓTULO, que é como se devolve ao operador a legibilidade que o
  -- número tira. Ninguém precisa decorar que 4 é `failed`.
  DROP VIEW IF EXISTS reduto_core.v_dlq;
  DROP VIEW IF EXISTS reduto_core.v_queue_stats;

  -- `jobs_history` (arquivo, 0004_maintenance) espelha `jobs`: converte junto, senão o
  -- archive_old_jobs passa a inserir número em coluna de texto.
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='jobs_history' AND column_name='status') = 'text' THEN
    -- `jobs_history` foi criada com LIKE jobs INCLUDING ALL: carrega CÓPIAS dos CHECKs, com o
    -- MESMO nome. Derrubar só os da `jobs` deixa os da history comparando smallint com texto.
    ALTER TABLE reduto_core.jobs_history DROP CONSTRAINT IF EXISTS jobs_status_check;
    ALTER TABLE reduto_core.jobs_history DROP CONSTRAINT IF EXISTS jobs_queue_check;
    ALTER TABLE reduto_core.jobs_history ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE reduto_core.jobs_history ALTER COLUMN status TYPE SMALLINT USING (CASE status
      WHEN 'pending' THEN 0 WHEN 'claimed' THEN 1 WHEN 'completed' THEN 2
      WHEN 'partial' THEN 3 WHEN 'failed' THEN 4 END);
    ALTER TABLE reduto_core.jobs_history ALTER COLUMN queue TYPE SMALLINT USING (CASE queue
      WHEN 'lite' THEN 0 WHEN 'full' THEN 1 WHEN 'monitor' THEN 2 WHEN 'dossier' THEN 3
      WHEN 'export' THEN 4 WHEN 'graph' THEN 5 WHEN 'custom' THEN 6 END);
    COMMENT ON COLUMN reduto_core.jobs_history.status IS '0=pending 1=claimed 2=completed 3=partial 4=failed';
    COMMENT ON COLUMN reduto_core.jobs_history.queue IS '0=lite 1=full 2=monitor 3=dossier 4=export 5=graph 6=custom';
  END IF;

  -- jobs.status : 0=pending 1=claimed 2=completed 3=partial 4=failed
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='jobs' AND column_name='status') = 'text' THEN
    ALTER TABLE reduto_core.jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
    ALTER TABLE reduto_core.jobs ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE reduto_core.jobs ALTER COLUMN status TYPE SMALLINT USING (CASE status
      WHEN 'pending' THEN 0 WHEN 'claimed' THEN 1 WHEN 'completed' THEN 2
      WHEN 'partial' THEN 3 WHEN 'failed' THEN 4 END);
    ALTER TABLE reduto_core.jobs ALTER COLUMN status SET DEFAULT 0;
    ALTER TABLE reduto_core.jobs ADD CONSTRAINT jobs_status_range_check
      CHECK (status >= 0 AND status <= 4);
    COMMENT ON COLUMN reduto_core.jobs.status IS '0=pending 1=claimed 2=completed 3=partial 4=failed';
  END IF;

  -- jobs.queue : 0=lite 1=full 2=monitor 3=dossier 4=export 5=graph 6=custom
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='jobs' AND column_name='queue') = 'text' THEN
    ALTER TABLE reduto_core.jobs DROP CONSTRAINT IF EXISTS jobs_queue_check;
    ALTER TABLE reduto_core.jobs ALTER COLUMN queue TYPE SMALLINT USING (CASE queue
      WHEN 'lite' THEN 0 WHEN 'full' THEN 1 WHEN 'monitor' THEN 2 WHEN 'dossier' THEN 3
      WHEN 'export' THEN 4 WHEN 'graph' THEN 5 WHEN 'custom' THEN 6 END);
    ALTER TABLE reduto_core.jobs ADD CONSTRAINT jobs_queue_range_check
      CHECK (queue >= 0 AND queue <= 6);
    COMMENT ON COLUMN reduto_core.jobs.queue IS '0=lite 1=full 2=monitor 3=dossier 4=export 5=graph 6=custom';
  END IF;

  -- job_events.event_type : 0=progress 1=source_completed 2=source_failed 3=candidate_selection_required
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='job_events' AND column_name='event_type') = 'text' THEN
    ALTER TABLE reduto_core.job_events DROP CONSTRAINT IF EXISTS job_events_event_type_check;
    ALTER TABLE reduto_core.job_events ALTER COLUMN event_type TYPE SMALLINT USING (CASE event_type
      WHEN 'progress' THEN 0 WHEN 'source_completed' THEN 1 WHEN 'source_failed' THEN 2
      WHEN 'candidate_selection_required' THEN 3 END);
    ALTER TABLE reduto_core.job_events ADD CONSTRAINT job_events_event_type_range_check
      CHECK (event_type >= 0 AND event_type <= 3);
    COMMENT ON COLUMN reduto_core.job_events.event_type IS '0=progress 1=source_completed 2=source_failed 3=candidate_selection_required';
  END IF;

  -- job_source_executions.status : 0=started 1=completed 2=failed
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='job_source_executions' AND column_name='status') = 'text' THEN
    ALTER TABLE reduto_core.job_source_executions DROP CONSTRAINT IF EXISTS job_source_executions_status_check;
    ALTER TABLE reduto_core.job_source_executions ALTER COLUMN status TYPE SMALLINT USING (CASE status
      WHEN 'started' THEN 0 WHEN 'completed' THEN 1 WHEN 'failed' THEN 2 END);
    ALTER TABLE reduto_core.job_source_executions ADD CONSTRAINT job_source_executions_status_range_check
      CHECK (status >= 0 AND status <= 2);
    COMMENT ON COLUMN reduto_core.job_source_executions.status IS '0=started 1=completed 2=failed';
  END IF;

  -- error_kind (job_source_executions e raw_results) : espelha SourceError.kind
  FOR r IN SELECT 'job_source_executions' AS t UNION ALL SELECT 'raw_results' LOOP
    IF (SELECT data_type FROM information_schema.columns
          WHERE table_schema='reduto_core' AND table_name=r.t AND column_name='error_kind') = 'text' THEN
      EXECUTE format('ALTER TABLE reduto_core.%I ALTER COLUMN error_kind TYPE SMALLINT USING (CASE error_kind
        WHEN ''TIMEOUT'' THEN 0 WHEN ''SCHEMA_MISMATCH'' THEN 1 WHEN ''AUTH_FAILED'' THEN 2
        WHEN ''CIRCUIT_OPEN'' THEN 3 WHEN ''RATE_LIMITED'' THEN 4 WHEN ''NOT_FOUND'' THEN 5
        WHEN ''UPSTREAM_ERROR'' THEN 6 END)', r.t);
      EXECUTE format('COMMENT ON COLUMN reduto_core.%I.error_kind IS ''0=TIMEOUT 1=SCHEMA_MISMATCH 2=AUTH_FAILED 3=CIRCUIT_OPEN 4=RATE_LIMITED 5=NOT_FOUND 6=UPSTREAM_ERROR''', r.t);
    END IF;
  END LOOP;

  -- raw_results.status : 0=started 1=completed 2=failed (o motor gravava 'ok'/'error')
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='raw_results' AND column_name='status') = 'text' THEN
    ALTER TABLE reduto_core.raw_results ALTER COLUMN status TYPE SMALLINT USING (CASE status
      WHEN 'started' THEN 0 WHEN 'ok' THEN 1 WHEN 'completed' THEN 1
      WHEN 'error' THEN 2 WHEN 'failed' THEN 2 END);
    ALTER TABLE reduto_core.raw_results ADD CONSTRAINT raw_results_status_range_check
      CHECK (status IS NULL OR (status >= 0 AND status <= 2));
    COMMENT ON COLUMN reduto_core.raw_results.status IS '0=started 1=completed 2=failed';
  END IF;

  -- quota_reservations : status 0=reserved 1=settled 2=released · operation_type 0=full 1=lite 2=dossier
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='reduto_core' AND table_name='quota_reservations' AND column_name='status') = 'text' THEN
    ALTER TABLE reduto_core.quota_reservations DROP CONSTRAINT IF EXISTS quota_reservations_status_check;
    ALTER TABLE reduto_core.quota_reservations DROP CONSTRAINT IF EXISTS quota_reservations_operation_type_check;
    ALTER TABLE reduto_core.quota_reservations ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE reduto_core.quota_reservations ALTER COLUMN status TYPE SMALLINT USING (CASE status
      WHEN 'reserved' THEN 0 WHEN 'settled' THEN 1 WHEN 'released' THEN 2 END);
    ALTER TABLE reduto_core.quota_reservations ALTER COLUMN status SET DEFAULT 0;
    ALTER TABLE reduto_core.quota_reservations ALTER COLUMN operation_type TYPE SMALLINT USING (CASE operation_type
      WHEN 'full_query' THEN 0 WHEN 'lite_query' THEN 1 WHEN 'dossier' THEN 2 END);
    COMMENT ON COLUMN reduto_core.quota_reservations.status IS '0=reserved 1=settled 2=released';
    COMMENT ON COLUMN reduto_core.quota_reservations.operation_type IS '0=full_query 1=lite_query 2=dossier';
  END IF;

  -- Índices reconstruídos com o predicado numérico (mesmas colunas, mesma seletividade).
  CREATE INDEX IF NOT EXISTS idx_jobs_claim
    ON reduto_core.jobs (queue, priority, available_at) WHERE status = 0;          -- pending
  CREATE INDEX IF NOT EXISTS idx_jobs_queue_priority
    ON reduto_core.jobs (queue, priority, created_at) WHERE status = 0;            -- pending
  CREATE INDEX IF NOT EXISTS idx_jobs_lease
    ON reduto_core.jobs (lease_expires_at) WHERE status = 1;                       -- claimed
  CREATE INDEX IF NOT EXISTS idx_jobs_dlq
    ON reduto_core.jobs (updated_at DESC) WHERE status = 4;                        -- failed
  CREATE INDEX IF NOT EXISTS idx_jobs_claimed_stale
    ON reduto_core.jobs (claimed_at) WHERE status = 1;                             -- claimed
  CREATE INDEX IF NOT EXISTS idx_jobs_claimed_lease_expires
    ON reduto_core.jobs (lease_expires_at) WHERE status = 1;                       -- claimed

  CREATE INDEX IF NOT EXISTS jobs_history_queue_priority_available_at_idx
    ON reduto_core.jobs_history (queue, priority, available_at) WHERE status = 0;
  CREATE INDEX IF NOT EXISTS jobs_history_claimed_at_idx
    ON reduto_core.jobs_history (claimed_at) WHERE status = 1;
  CREATE INDEX IF NOT EXISTS jobs_history_updated_at_idx
    ON reduto_core.jobs_history (updated_at DESC) WHERE status = 4;

  -- Views e archive_old_jobs() são redefinidas pela 0004 (que roda ANTES). No caminho legado elas
  -- foram derrubadas acima para liberar o ALTER TYPE: recria com a MESMA definição da 0004.
  CREATE OR REPLACE VIEW reduto_core.v_queue_label AS
  SELECT * FROM (VALUES
    (0,'lite'), (1,'full'), (2,'monitor'), (3,'dossier'), (4,'export'), (5,'graph'), (6,'custom')
  ) AS q(queue, queue_label);

  CREATE OR REPLACE VIEW reduto_core.v_job_status_label AS
  SELECT * FROM (VALUES
    (0,'pending'), (1,'claimed'), (2,'completed'), (3,'partial'), (4,'failed')
  ) AS s(status, status_label);

  CREATE OR REPLACE VIEW reduto_core.v_dlq AS
  SELECT j.id, j.job_id, q.queue_label AS queue, j.query_type, j.tenant_slug,
         j.attempts, j.max_attempts, j.result, j.payload, j.correlation_id, j.updated_at
  FROM reduto_core.jobs j
  LEFT JOIN reduto_core.v_queue_label q ON q.queue = j.queue
  WHERE j.status = 4 AND j.attempts >= j.max_attempts
  ORDER BY j.updated_at DESC;

  CREATE OR REPLACE VIEW reduto_core.v_queue_stats AS
  SELECT q.queue_label AS queue, s.status_label AS status, count(*) AS total,
         min(j.created_at) AS oldest_created_at,
         percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (now() - j.created_at))) AS median_age_seconds
  FROM reduto_core.jobs j
  LEFT JOIN reduto_core.v_queue_label q      ON q.queue  = j.queue
  LEFT JOIN reduto_core.v_job_status_label s ON s.status = j.status
  GROUP BY q.queue_label, s.status_label
  ORDER BY q.queue_label, s.status_label;
END $$;
