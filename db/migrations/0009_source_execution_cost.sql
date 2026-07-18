-- RB-03 (paridade dev com o owner Laravel: core/2026_07_18_000006): custo REAL medido
-- pelo provider na execução da fonte, em centavos. NULL = sem medição (catálogo decide).
ALTER TABLE clothos_core.job_source_executions ADD COLUMN IF NOT EXISTS cost_cents INTEGER NULL;
