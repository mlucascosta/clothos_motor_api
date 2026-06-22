-- =============================================================================
-- 0002_indexes_optimization.sql — Índices otimizados do motor CLOTHOS
-- Cada índice é justificado pela query real que o utiliza.
-- Idempotente: CREATE INDEX IF NOT EXISTS em todos.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- clothos_core.jobs — índices adicionais (idx_jobs_claim já criado em 0001)
-- ---------------------------------------------------------------------------

-- Listagem de DLQ: WHERE status='failed' — índice parcial cobre só as linhas
-- que interessam ao endpoint admin/engine/dlq, evitando scan de linhas
-- completed/pending que são a maioria da tabela.
-- Query: SELECT … FROM clothos_core.jobs WHERE status='failed' ORDER BY updated_at DESC
CREATE INDEX IF NOT EXISTS idx_jobs_dlq
  ON clothos_core.jobs (updated_at DESC)
  WHERE status = 'failed';

-- Lookup por job_id já coberto pelo UNIQUE constraint (jobs_job_id_unique),
-- que implicitamente cria um índice B-tree em job_id. Não duplicar.

-- Correlação: app Laravel e workers buscam job por correlation_id para
-- rastrear qual job pertence a qual query (polling, logs, auditoria).
-- Query: SELECT … FROM clothos_core.jobs WHERE correlation_id = $1
CREATE INDEX IF NOT EXISTS idx_jobs_correlation_id
  ON clothos_core.jobs (correlation_id);

-- Auditoria por tenant: dashboard admin e relatórios de uso listam jobs de
-- um tenant ordenados por recência. Sem este índice, filtrar por tenant_slug
-- em tabela de alta rotação faria seq scan.
-- Query: SELECT … FROM clothos_core.jobs WHERE tenant_slug = $1 ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_jobs_tenant_created
  ON clothos_core.jobs (tenant_slug, created_at DESC);

-- Backpressure check: getWaitingCount() conta jobs pending por queue.
-- idx_jobs_claim já cobre (queue, priority, available_at) WHERE status='pending';
-- uma query COUNT sobre o índice parcial (queue WHERE status='pending') é
-- satisfeita com um index-only scan sobre idx_jobs_claim sem acessar a heap.
-- Não criar índice duplicado — idx_jobs_claim já serve.

-- Reconciliação de stuck jobs (ReconcileStuckQueriesJob): busca linhas em
-- status='claimed' mais antigas que N minutos. Índice parcial limita o scan
-- apenas a linhas que ainda não concluíram (claimed é subconjunto pequeno).
-- Query: SELECT … FROM clothos_core.jobs WHERE status='claimed' AND claimed_at < now() - interval
CREATE INDEX IF NOT EXISTS idx_jobs_claimed_stale
  ON clothos_core.jobs (claimed_at)
  WHERE status = 'claimed';

-- ---------------------------------------------------------------------------
-- clothos_core.raw_results
-- ---------------------------------------------------------------------------

-- Série temporal por gateway: relatórios de performance/custo por provider
-- agrupados por janela de tempo (hora/dia). Cobre ORDER BY created_at DESC.
-- Query: SELECT … FROM raw_results WHERE gateway = $1 ORDER BY created_at DESC LIMIT n
CREATE INDEX IF NOT EXISTS idx_raw_results_gateway_created
  ON clothos_core.raw_results (gateway, created_at DESC);

-- Cache hit lookup: antes de chamar um provider, o motor verifica se já existe
-- resultado recente para (tipo_param, param). Este índice garante lookup O(log n)
-- em vez de seq scan. created_at DESC traz o resultado mais recente primeiro.
-- Query: SELECT … FROM raw_results WHERE tipo_param=$1 AND param=$2 ORDER BY created_at DESC LIMIT 1
CREATE INDEX IF NOT EXISTS idx_raw_results_param_lookup
  ON clothos_core.raw_results (tipo_param, param, created_at DESC);

-- Monitoramento de erros: alertas e dashboards filtram por status != 'ok'
-- para medir taxa de erro por janela de tempo.
-- Query: SELECT gateway, count(*) FROM raw_results WHERE status='error' AND created_at > $1 GROUP BY gateway
CREATE INDEX IF NOT EXISTS idx_raw_results_status_created
  ON clothos_core.raw_results (status, created_at DESC);

-- Rastreabilidade por correlation_id: quando o app precisa buscar todos os
-- resultados brutos associados a um job específico.
-- Query: SELECT … FROM raw_results WHERE correlation_id = $1
CREATE INDEX IF NOT EXISTS idx_raw_results_correlation_id
  ON clothos_core.raw_results (correlation_id);

-- GIN jsonb_path_ops: queries de extração de campos arbitrários no JSONB dos
-- resultados (ex.: @> '{"cpf_status":"regular"}' ou path operators).
-- jsonb_path_ops é menor e mais rápido que o GIN padrão (jsonb_ops) para
-- operadores @>, @? e @@; a desvantagem (não suporta ? e ?|) é irrelevante
-- aqui pois as queries são sempre sobre valores de caminhos, não chaves.
CREATE INDEX IF NOT EXISTS idx_raw_results_result_gin
  ON clothos_core.raw_results USING gin (result jsonb_path_ops);

-- ---------------------------------------------------------------------------
-- clothos_core.query_refs
-- ---------------------------------------------------------------------------

-- Auditoria por tenant: listar todas as pesquisas de um tenant ordenadas por
-- recência. Usado em relatórios de uso e conformidade LGPD.
-- Query: SELECT … FROM query_refs WHERE tenant_id = $1 ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_query_refs_tenant_created
  ON clothos_core.query_refs (tenant_id, created_at DESC);

-- correlation_id já coberto pelo UNIQUE constraint (implica B-tree).

-- ---------------------------------------------------------------------------
-- clothos_core.cache
-- ---------------------------------------------------------------------------

-- Expurgo de cache expirado: a função de manutenção (0004) faz
-- DELETE WHERE expires_at < now(). Sem índice em expires_at, o DELETE
-- faz seq scan em tabela potencialmente grande; com o índice, usa
-- index scan e só toca as páginas com TTL vencido.
-- Query: DELETE FROM cache WHERE expires_at < now()
CREATE INDEX IF NOT EXISTS idx_cache_expires_at
  ON clothos_core.cache (expires_at);

-- ---------------------------------------------------------------------------
-- clothos_core.providers
-- ---------------------------------------------------------------------------

-- Lookup de providers ativos: o motor filtra por enabled=true antes de
-- tentar chamar um provider. Índice parcial minimiza o scan quando a maioria
-- dos providers está habilitada (caso típico).
-- Query: SELECT … FROM providers WHERE slug = $1 AND enabled = true
CREATE INDEX IF NOT EXISTS idx_providers_enabled
  ON clothos_core.providers (slug)
  WHERE enabled = true;
