#!/usr/bin/env bash
# =============================================================================
# db/apply.sh — Bootstrap de DESENVOLVIMENTO do schema do motor CLOTHOS
#
# ⚠ DEV-ONLY. Em producao o OWNER unico do schema `clothos_core` e o Laravel
#   (role clothos_migration, 00-FOUNDATION/G1); este script NUNCA roda la.
#   Ele existe para subir um Postgres descartavel do motor sem o Laravel.
#
# Uso: DATABASE_URL="postgres://user:pass@host:port/dbname" ./db/apply.sh
# Idempotente: seguro executar multiplas vezes. Aplica TODAS as migrations
# de db/migrations/ na ordem numerica + seeds.
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

# Todas as migrations, em ordem numerica — um arquivo novo em db/migrations/
# entra automaticamente (a auditoria A3 pegou o script desatualizado ao
# enumerar migrations a mao; enumerar o diretorio elimina a classe do erro).
migrations=("${SCRIPT_DIR}"/migrations/*.sql)
total=$(( ${#migrations[@]} + 1 ))
step=0
for file in "${migrations[@]}"; do
  step=$((step + 1))
  name="$(basename "${file}" .sql)"
  echo "[${step}/${total}] ${name}..."
  run_sql "${name}" "${file}"
done

step=$((step + 1))
echo "[${step}/${total}] Seed de providers..."
run_sql "seeds/providers" "${SCRIPT_DIR}/seeds/providers.sql"

echo ""
echo "============================================================"
echo "  Schema aplicado com sucesso."
echo "============================================================"
echo ""
