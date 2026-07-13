# Banco do Motor

`migrations/0001_core_schema.sql` cria `clothos_core.jobs`, resultados brutos,
refs, estado de providers e cache PostgreSQL.

Runtime usa roles separadas: Laravel produz jobs; worker pode fazer claim e
escrever resultados, sem acesso aos schemas `tenant_*`; migrations usam role DDL
dedicada. PostgreSQL permanece em rede privada com TLS verificado.

Contrato completo: [`../../docs/spec/00-FOUNDATION.md`](../../docs/spec/00-FOUNDATION.md).
