/**
 * @fileoverview Documento de referência entre pesquisa e tenant na collection `query_refs`.
 * Separa auditoria de tenant do resultado bruto — o rawresult não carrega dados de tenant.
 * @module infrastructure/persistence/QueryRefDoc
 */

/**
 * Vincula uma pesquisa (`correlationId`) ao tenant que a originou.
 * Armazenado na coleção `query_refs` separada de `raw_results`.
 *
 * @typedef {Object} QueryRefDoc
 * @property {string} correlationId - Chave de correlação que une esta ref ao rawresult correspondente
 * @property {string} tenantId      - UUID do tenant que realizou a pesquisa (passado via X-Tenant-Id)
 * @property {string} gateway       - Gateway consultado (ex: "escavador", "directdata")
 * @property {string} fonte         - Fonte específica dentro do gateway
 * @property {Date}   createdAt     - Timestamp de criação para TTL e auditorias
 */
export interface QueryRefDoc {
  correlationId: string;
  tenantId: string;
  gateway: string;
  fonte: string;
  createdAt: Date;
}
