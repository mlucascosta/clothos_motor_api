# CLOTHOS Motor

Motor Node.js/TypeScript de execução de providers (plano de execução do produto Reduto).
Não é multi-tenant e nunca acessa schemas `tenant_*`.

## Estado

Worker completo: claim token, lease, heartbeat, recovery, shutdown gracioso, retry/DLQ.
Pipeline **Finder** implementado (`src/application/finder/`): executa o `execution_plan`
congelado que o Laravel resolve por produto (etapas, `fallback_group`, cobertura por
requisito), consulta o cache compartilhado (TTL `min(TTL_da_fonte, 7 dias)`, chave opaca —
CPF nunca em claro), grava bruto/`cache`/progresso durável e devolve `summary.coverage`.
Pipeline **Monitor** implementado (`src/application/monitor/`): poll por busca ativa —
Semanal → DataJud/CNJ, Mensal → Escavador (V6, ADR-0026). Circuit breaker por provider
ligado aos executores (P18). Não existe servidor HTTP: o antigo gateway foi removido.

## Transporte

PostgreSQL privado é o ÚNICO transporte (ADR-0025): Laravel produz jobs em
`clothos_core.jobs`, o worker faz claim `FOR UPDATE SKIP LOCKED`, grava resultado
bruto/progresso e o Laravel faz settle/projeção final. Nenhum HTTP, callback ou
webhook entre Laravel e worker.

## Comandos

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration   # exige PostgreSQL real
pnpm worker             # dev; producao: pnpm build && pnpm start:worker
```

`pnpm worker` exige `DATABASE_URL` (ou `MOTOR_DATABASE_URL`). `WORKER_QUEUE`
(`full` | `lite` | `monitor`, default `full`) escolhe o processador default da fila —
Finder para `full`/`lite`, Monitor para `monitor` (que sobe sem credencial DirectData).
`WORKER_PROCESSOR_MODULE` é opcional e só para injetar um processor customizado.

## Banco (dev)

`db/apply.sh` é bootstrap **dev-only** (aplica todas as `db/migrations/*.sql` + seeds em
um Postgres descartável). Em produção o owner único do schema `clothos_core` é o Laravel
(role `clothos_migration`) — o script nunca roda lá.

Especificações: [`../docs/spec/01-MOTOR-SECURITY.md`](../docs/spec/01-MOTOR-SECURITY.md).
