# clothos_motor_api — Database

Schema PostgreSQL 16 do motor CLOTHOS. Implementa a arquitetura single-store da ADR-0019: um unico PostgreSQL substitui BullMQ/Redis (fila), MongoDB (resultados brutos) e Redis cache.

## Como aplicar

```bash
DATABASE_URL="postgres://user:REDACTED@host:5432/clothos_core" ./db/apply.sh
```

O script e idempotente — pode ser executado multiplas vezes sem efeito colateral.

### Sem psql no host (CI / Docker)

```bash
docker run -d --rm --name clothos_db \
  -e POSTGRES_PASSWORD=REDACTED \
  -e POSTGRES_DB=clothos_core \
  -p 55432:5432 postgres:16-alpine

until docker exec clothos_db pg_isready -U postgres -d clothos_core; do sleep 1; done

export PSQL_CMD="docker exec -i clothos_db psql -U postgres -d clothos_core"
export DATABASE_URL="postgres://postgres:REDACTED@localhost:55432/clothos_core"
bash db/apply.sh
```

## Ordem das migrations

| Arquivo | Conteudo |
|---|---|
| `0001_core_schema.sql` | Schema `clothos_core`, 5 tabelas, UNIQUE em `jobs.job_id`, CHECK constraints, indice parcial de claim |
| `0002_indexes_optimization.sql` | Todos os indices otimizados com justificativa inline |
| `0003_autovacuum_tuning.sql` | Afinacao de autovacuum para `jobs` e `raw_results` |
| `0004_maintenance.sql` | Funcoes de manutencao, tabela `jobs_history`, views DLQ e queue_stats |
| `seeds/providers.sql` | 6 providers com circuit breaker em estado `closed` |

## Mapa de tabelas — o que cada uma substitui

| Tabela | Substitui | Justificativa |
|---|---|---|
| `clothos_core.jobs` | BullMQ + Redis (fila) | FOR UPDATE SKIP LOCKED atomico; Reserve + enqueue na mesma transacao ACID (licao Shopify) |
| `clothos_core.raw_results` | MongoDB raw_results | JSONB nativo; queries SQL sem ODM |
| `clothos_core.query_refs` | MongoDB query_refs | Correlacao tenant-pesquisa; JOIN com jobs via correlation_id |
| `clothos_core.providers.circuit_breaker_state` | Redis sorted-set CB | JSONB + pg_advisory_xact_lock + transacao |
| `clothos_core.cache` | Redis cache | UNLOGGED (sem WAL) + TTL por coluna expires_at |

## Decisoes de otimizacao

### Por que o indice parcial de claim e o fator n1 de performance da fila

O padrao FOR UPDATE SKIP LOCKED beneficia de um indice que ja filtra as linhas elegiveis antes do lock. Sem o indice parcial, o worker faria um seq scan de toda a tabela. Com idx_jobs_claim ON (queue, priority, available_at) WHERE status='pending', o planner acessa apenas linhas pending (subconjunto pequeno), ordenadas pela chave de despacho, entregando o job correto em O(log n).

A natureza parcial elimina 80-95% das linhas da visao do indice: linhas claimed, completed e failed nunca entram no indice — o B-tree permanece compacto e o vacuum nao precisa reescrever paginas do indice ao completar jobs.

### Por que GIN jsonb_path_ops em raw_results.result

O GIN com jsonb_path_ops indexa caminhos de valor (nao chaves isoladas), resultando num indice 30-40% menor que jsonb_ops e com lookup mais rapido para os operadores @>, @? e @@ — os unicos usados nas queries de extracao. A desvantagem (?, ?|, ?& nao suportados) e irrelevante aqui.

### Por que UNLOGGED no cache

Tabelas UNLOGGED nao geram WAL: writes 3-5x mais rapidos. O custo (dados perdidos em crash do servidor) e aceitavel para cache — o sistema volta apos reinicializacao com cache frio, e as proximas requisicoes populam o cache novamente.

Atencao: tabelas UNLOGGED nao participam do autovacuum. O expurgo de entradas expiradas e responsabilidade exclusiva de clothos_core.purge_expired_cache(), que deve ser agendada via pg_cron a cada 5-15 minutos.

### Por que autovacuum afinado em jobs

Cada job gera 3-4 UPDATEs (pending → claimed → completed/failed). Com autovacuum_vacuum_scale_factor=0.20 (padrao), uma tabela de 10k linhas ativas so recebe vacuum apos acumular 2k dead tuples — muito para uma fila. Reduzindo para 0.05 (5%), o vacuum dispara mais cedo, mantendo o indice parcial de claim compacto.

autovacuum_vacuum_cost_limit=400 (padrao: 200) permite ao worker de vacuum varrer mais paginas por ciclo antes de dormir.

### Por que indices parciais na DLQ e em claimed_stale

Estados failed e claimed representam fracao minima das linhas na steady state. Indices parciais nao indexam linhas em outros estados, mantendo o B-tree pequeno e o vacuum do indice rapido.

## Manutencao operacional

### Expurgo de cache (obrigatorio — UNLOGGED nao tem autovacuum)

```sql
SELECT clothos_core.purge_expired_cache();
-- Recomendado: a cada 5-15 minutos via pg_cron
```

### Arquivamento de jobs antigos

```sql
SELECT clothos_core.archive_old_jobs();            -- padrao: 7 dias
SELECT clothos_core.archive_old_jobs('30 days');   -- retencao customizada
```

### Expurgo de raw_results antigos

```sql
SELECT clothos_core.purge_old_raw_results();           -- padrao: 30 dias
SELECT clothos_core.purge_old_raw_results('60 days');
```

### Dashboard de fila (substitui Bull Board)

```sql
SELECT * FROM clothos_core.v_queue_stats;
```

### Dead Letter Queue

```sql
SELECT * FROM clothos_core.v_dlq LIMIT 50;

-- Reprocessar um job
UPDATE clothos_core.jobs
   SET status = 'pending', attempts = 0, available_at = now()
 WHERE id = <id>;
```
