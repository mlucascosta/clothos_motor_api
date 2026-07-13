# CLOTHOS Motor

Motor Node.js/TypeScript de execucao de providers. Nao e multi-tenant e nunca
acessa schemas `tenant_*`.

## Estado

Gateway Hono, adapters de providers, stores PostgreSQL e `JobRepository` existem.
Worker B0 implementa claim token, lease, heartbeat, recovery e shutdown gracioso.
Pipeline Finder completo permanece B1 pendente.

## Transporte

Fluxo normal usa `clothos_core.jobs` no PostgreSQL privado: Laravel produz jobs,
worker faz claim `FOR UPDATE SKIP LOCKED`, grava resultado bruto e Laravel faz
persistencia/settle final. Nenhum endpoint HTTP publico comunica Laravel e worker.

Gateway Hono e somente superficie interna transitoria. Deve ficar em loopback ou
rede privada, protegido por mTLS/rede, ate ser absorvido pelo worker.

## Comandos

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration
pnpm worker
```

`pnpm worker` exige `DATABASE_URL` (ou `MOTOR_DATABASE_URL`) e
`WORKER_PROCESSOR_MODULE`, caminho de módulo que exporta `default` compatível
com `JobProcessor`. B0 não inclui processor Finder padrão.

Especificacoes: [`../docs/spec/01-MOTOR-SECURITY.md`](../docs/spec/01-MOTOR-SECURITY.md).
