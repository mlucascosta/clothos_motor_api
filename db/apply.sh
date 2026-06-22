#!/usr/bin/env bash
# =============================================================================
# db/apply.sh — Aplica todas as migrations e seeds do motor CLOTHOS
# Uso: DATABASE_URL="postgres://user:pass@host:port/dbname" ./db/apply.sh
# Idempotente: seguro executar multiplas vezes.
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---------------------------------------------------------------------------
# Validacao de pre-requisitos
# ---------------------------------------------------------------------------
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERRO: DATABASE_URL nao definida." >&2
  echo "Uso: DATABASE_URL=postgres://user:pass@host:port/dbname ./db/apply.sh" >&2
  exit 1
fi

# Detecta psql no host. Para CI sem psql local, defina PSQL_CMD manualmente:
#   export PSQL_CMD="docker exec -i clothos_db psql -U postgres -d clothos_core"
if [[ -z "${PSQL_CMD:-}" ]]; then
  if command -v psql &>/dev/null; then
    PSQL_CMD="psql \"\${DATABASE_URL}\""
  else
    echo "AVISO: psql nao encontrado no PATH." >&2
    echo "Defina PSQL_CMD para usar docker exec ou outro wrapper." >&2
    echo "Exemplo:" >&2
    echo "  export PSQL_CMD=\"docker exec -i clothos_db psql -U postgres -d clothos_core\"" >&2
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Funcao auxiliar: executa um arquivo SQL
# ---------------------------------------------------------------------------
run_sql() {
  local label="$1"
  local file="$2"
  echo "  -> Aplicando ${label}..."
  # SQL vem via stdin (nao --file): assim funciona tanto com `psql "$DATABASE_URL"`
  # no host quanto com `docker exec -i ... psql` (onde o caminho do host nao existe
  # dentro do container; o redirecionamento alimenta o stdin do psql remoto).
  eval "${PSQL_CMD}" \
    --single-transaction \
    --set ON_ERROR_STOP=1 \
    --quiet \
    < "${file}"
  echo "     OK: ${label}"
}

# ---------------------------------------------------------------------------
# Aplicacao na ordem correta
# ---------------------------------------------------------------------------
echo ""
echo "============================================================"
echo "  CLOTHOS Motor -- Aplicando schema de banco de dados"
echo "============================================================"
echo ""

echo "[1/5] Schema e tabelas base..."
run_sql "0001_core_schema" "${SCRIPT_DIR}/migrations/0001_core_schema.sql"

echo "[2/5] Indices otimizados..."
run_sql "0002_indexes_optimization" "${SCRIPT_DIR}/migrations/0002_indexes_optimization.sql"

echo "[3/5] Afinacao de autovacuum..."
run_sql "0003_autovacuum_tuning" "${SCRIPT_DIR}/migrations/0003_autovacuum_tuning.sql"

echo "[4/5] Funcoes de manutencao e views..."
run_sql "0004_maintenance" "${SCRIPT_DIR}/migrations/0004_maintenance.sql"

echo "[5/5] Seed de providers..."
run_sql "seeds/providers" "${SCRIPT_DIR}/seeds/providers.sql"

echo ""
echo "============================================================"
echo "  Schema aplicado com sucesso."
echo "============================================================"
echo ""
