-- =============================================================================
-- 0001_core_schema.sql — Schema e tabelas base do motor CLOTHOS
-- ADR-0019: single-store PostgreSQL — substitui BullMQ/Redis + MongoDB
-- Idempotente: seguro executar múltiplas vezes.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS reduto_core;

-- ---------------------------------------------------------------------------
-- TABELA: reduto_core.jobs
-- Fila de jobs via FOR UPDATE SKIP LOCKED (substitui BullMQ/Redis).
-- Schema EXATO da ADR-0019 — nomes de coluna são contrato público.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reduto_core.jobs (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id         UUID NOT NULL,
  queue          SMALLINT NOT NULL,                     -- 0=lite 1=full 2=monitor 3=dossier 4=export 5=graph 6=custom
  priority       SMALLINT NOT NULL DEFAULT 5,           -- 1 alta … 10 baixa
  status         SMALLINT NOT NULL DEFAULT 0,           -- 0=pending 1=claimed 2=completed 3=partial 4=failed
  tenant_slug    TEXT NOT NULL,                         -- rótulo de correlação (motor NÃO isola tenant)
  query_type     TEXT NOT NULL,
  identifier     TEXT NOT NULL,                         -- CPF=SHA-256 | CNPJ=plaintext alfanumérico
  plan           TEXT NOT NULL,
  payload        JSONB NOT NULL DEFAULT '{}',
  result         JSONB,                                 -- escrito pelo motor ao finalizar
  cost_reserved  INTEGER NOT NULL,                      -- teto reservado (ADR-0017)
  cost_actual    INTEGER,                               -- preenchido no resultado (ADR-0018)
  attempts       SMALLINT NOT NULL DEFAULT 0,
  max_attempts   SMALLINT NOT NULL DEFAULT 2,
  available_at   TIMESTAMPTZ NOT NULL DEFAULT now(),    -- agendamento / backoff exponencial
  claimed_at     TIMESTAMPTZ,
  claimed_by     TEXT,                                  -- id do worker que fez claim
  correlation_id UUID NOT NULL,
  requested_by   UUID NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- UNIQUE separado para idempotência de enqueue (job_id duplicado → falha o INSERT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'jobs_job_id_unique'
      AND conrelid = 'reduto_core.jobs'::regclass
  ) THEN
    ALTER TABLE reduto_core.jobs ADD CONSTRAINT jobs_job_id_unique UNIQUE (job_id);
  END IF;
END$$;

-- CHECK constraints de domínio
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'jobs_status_check'
      AND conrelid = 'reduto_core.jobs'::regclass
  ) THEN
    ALTER TABLE reduto_core.jobs ADD CONSTRAINT jobs_status_check
      CHECK (status BETWEEN 0 AND 4);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'jobs_queue_check'
      AND conrelid = 'reduto_core.jobs'::regclass
  ) THEN
    ALTER TABLE reduto_core.jobs ADD CONSTRAINT jobs_queue_check
      CHECK (queue BETWEEN 0 AND 6);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'jobs_priority_check'
      AND conrelid = 'reduto_core.jobs'::regclass
  ) THEN
    ALTER TABLE reduto_core.jobs ADD CONSTRAINT jobs_priority_check
      CHECK (priority BETWEEN 1 AND 10);
  END IF;
END$$;

-- Índice parcial de claim — fator nº1 de performance da fila (ADR-0019).
-- Cobre apenas as linhas elegíveis (status='pending'), ordenadas por
-- prioridade + idade. Workers que fazem SKIP LOCKED sobre este índice
-- nunca tocam linhas em outros estados.
CREATE INDEX IF NOT EXISTS idx_jobs_claim
  ON reduto_core.jobs (queue, priority, available_at)
  WHERE status = 0;   -- pending

-- ---------------------------------------------------------------------------
-- TABELA: reduto_core.raw_results
-- Resultados brutos dos providers (substitui MongoDB clothos_motor.raw_results).
-- JSONB com jsonb_path_ops para queries de extração de campos arbitrários.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reduto_core.raw_results (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  gateway        TEXT NOT NULL,                -- slug do provider (escavador, datajud…)
  fonte          TEXT NOT NULL,                -- identificador interno da fonte/endpoint
  tipo_param     TEXT,                         -- 'cpf' | 'cnpj' | 'nome' | null
  param          TEXT,                         -- CPF=hash SHA-256; CNPJ/outros=plaintext
  result         JSONB,                        -- payload bruto devolvido pelo provider
  status         SMALLINT NOT NULL,            -- 0=started 1=completed 2=failed
  error_kind     SMALLINT,                     -- SourceErrorKind (0=TIMEOUT … 6=UPSTREAM_ERROR)
  correlation_id TEXT,                         -- liga ao job que originou esta chamada
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: reduto_core.query_refs
-- Correlação tenant ↔ pesquisa (substitui MongoDB clothos_motor.query_refs).
-- Permite auditoria e rastreabilidade sem consultar raw_results diretamente.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reduto_core.query_refs (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  correlation_id TEXT NOT NULL,
  tenant_id      TEXT NOT NULL,                -- slug ou id do tenant (rótulo de auditoria)
  gateway        TEXT NOT NULL,
  fonte          TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'query_refs_correlation_id_unique'
      AND conrelid = 'reduto_core.query_refs'::regclass
  ) THEN
    ALTER TABLE reduto_core.query_refs
      ADD CONSTRAINT query_refs_correlation_id_unique UNIQUE (correlation_id);
  END IF;
END$$;

-- ---------------------------------------------------------------------------
-- TABELA: reduto_core.providers
-- Estado do circuit breaker por provider (substitui sorted-set Redis).
-- Atomicidade via pg_advisory_xact_lock + transação (ADR-0019 §8.6).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reduto_core.providers (
  slug                   TEXT PRIMARY KEY,
  name                   TEXT NOT NULL,
  circuit_breaker_state  JSONB NOT NULL DEFAULT
    '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
  enabled                BOOLEAN NOT NULL DEFAULT true,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: reduto_core.cache  (UNLOGGED — padrão Solid Cache)
-- Cache de resultados de providers (substitui Redis cache).
-- UNLOGGED: sem WAL → writes ~3-5x mais rápidos; dados perdidos em crash do
-- servidor (aceitável para cache — na reinicialização o cache está vazio e
-- as requisições caem direto nos providers até o cache esquentar novamente).
-- ---------------------------------------------------------------------------
CREATE UNLOGGED TABLE IF NOT EXISTS reduto_core.cache (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
