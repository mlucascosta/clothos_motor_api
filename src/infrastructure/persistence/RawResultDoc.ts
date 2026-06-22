/**
 * @fileoverview Documento de resultado bruto armazenado em PostgreSQL (single-store, ADR-0019).
 * Representa um resultado não-processado de uma requisição a um provedor externo.
 * @module infrastructure/persistence/RawResultDoc
 */

/**
 * Documento de resultado bruto armazenado na tabela PostgreSQL `raw_results`.
 * Usado para auditoria, debugging e cálculo de custos.
 *
 * CPF é armazenado em hash SHA-256 se `tipo_param === 'cpf_cnpj'`.
 * Outros parâmetros são armazenados em texto claro.
 *
 * @typedef {Object} RawResultDoc
 * @property {string} gateway - Identificador do gateway de dados (ex: "escavador", "apibrasil")
 * @property {string} fonte - Nome da fonte consultada dentro do gateway
 * @property {string | null} tipo_param - Tipo do parâmetro de busca (ex: "cpf_cnpj", "nome", null se não aplicável)
 * @property {string | null} param - Valor do parâmetro de busca (CPF em hash se tipo_param=cpf_cnpj, ou string literal)
 * @property {unknown} result - Resposta bruta da API (JSON parseado ou string)
 * @property {'success' | 'error'} status - Status da requisição (sucesso ou erro)
 * @property {string} [error_kind]     - Tipo de erro se status='error' (ex: "TIMEOUT", "AUTH_FAILED", "UPSTREAM_ERROR")
 * @property {string} [correlationId]  - ID de correlação para rastreamento distribuído; chave que une este doc ao query_refs correspondente
 * @property {Date}   created_at       - Timestamp de criação do registro (para TTL e limpeza)
 */
export interface RawResultDoc {
  gateway: string;
  fonte: string;
  tipo_param: string | null;
  param: string | null;
  result: unknown;
  status: 'success' | 'error';
  error_kind?: string;
  correlationId?: string;
  created_at: Date;
}
