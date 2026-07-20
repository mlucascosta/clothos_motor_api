-- =============================================================================
-- 0004_maintenance.sql — Funções de manutenção operacional do motor CLOTHOS
-- Idempotente: CREATE OR REPLACE FUNCTION em todas as funções.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- reduto_core.purge_expired_cache()
--
-- Expurga entradas de cache com TTL vencido. Deve ser chamada periodicamente
-- (recomendado: a cada 5-15 minutos via pg_cron ou cron externo).
-- Retorna o número de linhas deletadas para logging/alertas.
--
-- TABELA UNLOGGED: o autovacuum não atua. Este DELETE é o único mecanismo
-- de reclaim de espaço. Frequência adequada previne crescimento ilimitado.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reduto_core.purge_expired_cache()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM reduto_core.cache
  WHERE expires_at < now();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION reduto_core.purge_expired_cache() IS
  'Expurga entradas expiradas da tabela UNLOGGED cache. '
  'Chamar via pg_cron a cada 5-15 min. Retorna nº de linhas deletadas.';

-- ---------------------------------------------------------------------------
-- reduto_core.archive_old_jobs(retention_interval INTERVAL)
--
-- Arquiva (move para jobs_history) e expurga jobs concluídos ou falhos mais
-- antigos que retention_interval. Previne bloat da tabela de alta rotação.
-- ADR-0019 Consequências: "arquivar/expurgar jobs concluídos (job de limpeza)".
--
-- Parâmetro:
--   retention_interval — ex.: '7 days', '30 days'. Default: 7 dias.
--
-- Estratégia batch: deleta em blocos de 1000 para não gerar uma transação
-- longa que bloquearia leituras (autovacuum pode correr entre batches).
-- Retorna total de linhas arquivadas.
-- ---------------------------------------------------------------------------

-- Tabela de histórico para jobs arquivados (estrutura idêntica a jobs).
CREATE TABLE IF NOT EXISTS reduto_core.jobs_history (
  LIKE reduto_core.jobs INCLUDING ALL
);

-- Índice na tabela de histórico para consultas de auditoria por tenant/período.
CREATE INDEX IF NOT EXISTS idx_jobs_history_tenant_created
  ON reduto_core.jobs_history (tenant_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_jobs_history_job_id
  ON reduto_core.jobs_history (job_id);

CREATE OR REPLACE FUNCTION reduto_core.archive_old_jobs(
  retention_interval INTERVAL DEFAULT INTERVAL '7 days'
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  total_archived INTEGER := 0;
  batch_size     CONSTANT INTEGER := 1000;
  batch_count    INTEGER;
BEGIN
  LOOP
    -- Move batch para histórico e deleta da tabela ativa numa única operação.
    WITH moved AS (
      DELETE FROM reduto_core.jobs
      WHERE id IN (
        SELECT id FROM reduto_core.jobs
        WHERE status IN (2, 3, 4)   -- completed | partial | failed
          AND updated_at < now() - retention_interval
        LIMIT batch_size
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    )
    -- OVERRIDING SYSTEM VALUE necessário porque jobs_history.id é GENERATED ALWAYS
    -- (herdado via LIKE jobs INCLUDING ALL) e SELECT * inclui o valor concreto de id.
    INSERT INTO reduto_core.jobs_history
    OVERRIDING SYSTEM VALUE
    SELECT * FROM moved;

    GET DIAGNOSTICS batch_count = ROW_COUNT;
    total_archived := total_archived + batch_count;

    EXIT WHEN batch_count < batch_size;  -- último batch menor que 1000 → fim
  END LOOP;

  RETURN total_archived;
END;
$$;

COMMENT ON FUNCTION reduto_core.archive_old_jobs(INTERVAL) IS
  'Move jobs concluídos/falhos mais antigos que retention_interval para '
  'jobs_history em batches de 1000. Previne bloat da tabela de alta rotação. '
  'Chamar diariamente via pg_cron. Padrão: 7 dias.';

-- ---------------------------------------------------------------------------
-- reduto_core.purge_old_raw_results(retention_interval INTERVAL)
--
-- Expurga resultados brutos antigos da tabela raw_results.
-- Estes dados têm valor operacional por ~30 dias; após isso são redundantes
-- com os resultados refinados persistidos pelo app em reduto_results.
-- Separado de archive_old_jobs para controle de retenção independente.
-- Retorna nº de linhas deletadas.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reduto_core.purge_old_raw_results(
  retention_interval INTERVAL DEFAULT INTERVAL '30 days'
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  total_deleted INTEGER := 0;
  batch_size    CONSTANT INTEGER := 2000;
  batch_count   INTEGER;
BEGIN
  LOOP
    DELETE FROM reduto_core.raw_results
    WHERE id IN (
      SELECT id FROM reduto_core.raw_results
      WHERE created_at < now() - retention_interval
      LIMIT batch_size
    );

    GET DIAGNOSTICS batch_count = ROW_COUNT;
    total_deleted := total_deleted + batch_count;

    EXIT WHEN batch_count < batch_size;
  END LOOP;

  RETURN total_deleted;
END;
$$;

COMMENT ON FUNCTION reduto_core.purge_old_raw_results(INTERVAL) IS
  'Expurga raw_results mais antigos que retention_interval em batches de 2000. '
  'Padrão: 30 dias. Chamar semanalmente via pg_cron.';

-- ---------------------------------------------------------------------------
-- VIEW: reduto_core.v_dlq
--
-- Dead Letter Queue: jobs que esgotaram todas as tentativas.
-- ADR-0019 §9: "DLQ é só uma query (WHERE status='failed')".
-- A view encapsula a semântica para evitar que consumers precisem conhecer
-- a condição exata; suporta o endpoint GET /admin/engine/dlq.
-- ---------------------------------------------------------------------------
-- Tabelas de rotulo: traduzem o numero de volta para o nome. A coluna e numerica
-- (ADR-0024: indice, storage, sem typo); a VIEW e legivel. Quem opera le a view.
CREATE OR REPLACE VIEW reduto_core.v_queue_label AS
SELECT * FROM (VALUES
  (0,'lite'), (1,'full'), (2,'monitor'), (3,'dossier'), (4,'export'), (5,'graph'), (6,'custom')
) AS q(queue, queue_label);

CREATE OR REPLACE VIEW reduto_core.v_job_status_label AS
SELECT * FROM (VALUES
  (0,'pending'), (1,'claimed'), (2,'completed'), (3,'partial'), (4,'failed')
) AS s(status, status_label);

CREATE OR REPLACE VIEW reduto_core.v_dlq AS
SELECT
  j.id, j.job_id,
  q.queue_label AS queue,
  j.query_type, j.tenant_slug, j.attempts, j.max_attempts,
  j.result, j.payload, j.correlation_id, j.updated_at
FROM reduto_core.jobs j
LEFT JOIN reduto_core.v_queue_label q ON q.queue = j.queue
WHERE j.status = 4                    -- JobStatus::FAILED
  AND j.attempts >= j.max_attempts
ORDER BY j.updated_at DESC;

COMMENT ON VIEW reduto_core.v_dlq IS
  'Dead Letter Queue: jobs que esgotaram max_attempts. '
  'Reprocessar: UPDATE jobs SET status=0, attempts=0, available_at=now() WHERE id=?.';

CREATE OR REPLACE VIEW reduto_core.v_queue_stats AS
SELECT
  q.queue_label                                   AS queue,
  s.status_label                                  AS status,
  count(*)                                        AS total,
  min(j.created_at)                               AS oldest_created_at,
  percentile_cont(0.5) WITHIN GROUP (
    ORDER BY EXTRACT(EPOCH FROM (now() - j.created_at))
  )                                               AS median_age_seconds
FROM reduto_core.jobs j
LEFT JOIN reduto_core.v_queue_label q      ON q.queue  = j.queue
LEFT JOIN reduto_core.v_job_status_label s ON s.status = j.status
GROUP BY q.queue_label, s.status_label
ORDER BY q.queue_label, s.status_label;

COMMENT ON VIEW reduto_core.v_queue_stats IS
  'Estatisticas da fila por (queue, status), com ROTULO legivel — a coluna e numerica '
  '(ADR-0024), a view traduz. Substitui Bull Board (ADR-0019).';
