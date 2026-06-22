-- =============================================================================
-- 0003_autovacuum_tuning.sql — Afinação de autovacuum para tabelas de alta rotação
-- ADR-0019 Consequências: "Bloat/VACUUM na tabela de alta rotação → autovacuum
-- afinado + arquivar/expurgar jobs concluídos."
-- Idempotente: ALTER TABLE SET é idempotente por natureza.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- clothos_core.jobs — fila de alta rotação
--
-- Perfil: linhas são inseridas (pending), atualizadas múltiplas vezes
-- (claimed → completed/failed) e permanecem na tabela por minutos/horas antes
-- do job de limpeza. Cada UPDATE gera uma dead tuple; sem vacuum frequente,
-- o bloat acumula e degrada os index scans do SKIP LOCKED.
--
-- Valores escolhidos:
--   autovacuum_vacuum_scale_factor = 0.05
--     → Dispara vacuum quando 5% das tuplas estão mortas (padrão=20%).
--       Em tabela de ~50k linhas ativas, vacuuma a cada ~2.5k dead tuples.
--
--   autovacuum_analyze_scale_factor = 0.02
--     → Atualiza estatísticas quando 2% das linhas mudam (padrão=10%).
--       Mantém planos de query precisos em tabela com distribuição de status
--       muito assimétrica (pending << completed na steady state).
--
--   autovacuum_vacuum_cost_delay = 2ms
--     → Reduz o throttle I/O entre páginas varridas (padrão=2ms já é baixo;
--       explicitamos para garantir que não seja herdado um valor alto de
--       configuração global de ambiente mais conservador).
--
--   autovacuum_vacuum_cost_limit = 400
--     → Aumenta o orçamento de custo por rodada (padrão=200).
--       Permite ao autovacuum limpar mais páginas por iteração sem pausas
--       longas em tabela de writes intensos.
--
--   autovacuum_freeze_max_age = 500000000
--     → Força anti-wraparound vacuum quando a tabela atinge 500M transações
--       de idade (padrão=200M). Evita vacuums forçados em horários de pico
--       numa tabela pequena-mas-ativa onde o padrão seria agressivo demais.
--       500M dá margem suficiente para o vacuum regular cuidar do freeze.
-- ---------------------------------------------------------------------------
ALTER TABLE clothos_core.jobs SET (
  autovacuum_vacuum_scale_factor   = 0.05,
  autovacuum_analyze_scale_factor  = 0.02,
  autovacuum_vacuum_cost_delay     = 2,
  autovacuum_vacuum_cost_limit     = 400,
  autovacuum_freeze_max_age        = 500000000
);

-- ---------------------------------------------------------------------------
-- clothos_core.raw_results — escrita intensiva de resultados de providers
--
-- Perfil: apenas INSERTs (imutável após inserção) + eventual DELETE no expurgo.
-- Dead tuples vêm do expurgo de linhas antigas; analyze é importante porque
-- a distribuição de (gateway, status) muda com falhas de providers.
--
--   autovacuum_vacuum_scale_factor = 0.10
--     → Mais tolerante que jobs (sem updates, dead tuples só em DELETE de expurgo).
--
--   autovacuum_analyze_scale_factor = 0.05
--     → Atualiza estatísticas quando 5% das linhas mudam; garante planos
--       corretos para queries de agregação por gateway/status.
-- ---------------------------------------------------------------------------
ALTER TABLE clothos_core.raw_results SET (
  autovacuum_vacuum_scale_factor   = 0.10,
  autovacuum_analyze_scale_factor  = 0.05,
  autovacuum_vacuum_cost_delay     = 2,
  autovacuum_vacuum_cost_limit     = 200
);

-- ---------------------------------------------------------------------------
-- clothos_core.query_refs — escrita moderada, leitura de auditoria
--
-- Perfil similar a raw_results: INSERTs + expurgo eventual. Valores conservadores
-- pois a pressão de bloat é menor.
-- ---------------------------------------------------------------------------
ALTER TABLE clothos_core.query_refs SET (
  autovacuum_vacuum_scale_factor   = 0.10,
  autovacuum_analyze_scale_factor  = 0.05
);

-- ---------------------------------------------------------------------------
-- Nota sobre clothos_core.cache (UNLOGGED)
--
-- Tabelas UNLOGGED NÃO participam do autovacuum (não geram WAL; o daemon
-- autovacuum não as processa). O expurgo de linhas expiradas é responsabilidade
-- exclusiva da função de manutenção em 0004_maintenance.sql
-- (clothos_core.purge_expired_cache). Executar via pg_cron ou cron externo
-- com frequência adequada ao TTL médio do cache (recomendado: a cada 5-15 min).
--
-- Não há ALTER TABLE … SET (autovacuum_…) aplicável a UNLOGGED tables.
-- ---------------------------------------------------------------------------
