-- =============================================================================
-- 0005_job_claim_leases.sql - Ownership token and renewable lease for B0 jobs
-- Additive and idempotent: existing claimed rows are recovered by the worker.
-- =============================================================================

ALTER TABLE reduto_core.jobs
  ADD COLUMN IF NOT EXISTS claim_token UUID,
  ADD COLUMN IF NOT EXISTS lease_expires_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS reduto_core.jobs_history
  ADD COLUMN IF NOT EXISTS claim_token UUID,
  ADD COLUMN IF NOT EXISTS lease_expires_at TIMESTAMPTZ;

-- Reclaim scans only active claims, including legacy rows claimed before this
-- migration that have no lease yet.
CREATE INDEX IF NOT EXISTS idx_jobs_claimed_lease_expires
  ON reduto_core.jobs (lease_expires_at)
  WHERE status = 1;   -- claimed
