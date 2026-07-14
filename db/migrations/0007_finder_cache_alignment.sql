-- 0007_finder_cache_alignment.sql
-- Alinha o schema dev/test do motor ao schema OWNER (Laravel, core/2026_07_13_000006):
-- colunas de cache/proveniencia que o pipeline Finder precisa escrever.
-- Laravel e a fonte unica do schema em producao (ADR-0025 / 00-FOUNDATION, role
-- clothos_migration); estas migrations do motor sao bootstrap de dev/test e devem
-- espelhar exatamente as colunas do owner. Aditivo e idempotente.

-- job_source_executions: codigo da fonte + resultado de cache
ALTER TABLE clothos_core.job_source_executions
  ADD COLUMN IF NOT EXISTS source_code   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cache_hit     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cache_key     TEXT,
  ADD COLUMN IF NOT EXISTS raw_result_id BIGINT;

-- raw_results: liga a linha de auditoria bruta a chave de cache opaca
ALTER TABLE clothos_core.raw_results
  ADD COLUMN IF NOT EXISTS cache_key TEXT;

CREATE INDEX IF NOT EXISTS idx_raw_results_cache_key
  ON clothos_core.raw_results (cache_key, created_at DESC);

-- cache compartilhado: lookup por expiracao (TTL <= 7 dias)
CREATE INDEX IF NOT EXISTS idx_cache_expires_at
  ON clothos_core.cache (expires_at);
