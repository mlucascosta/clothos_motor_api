/**
 * @fileoverview PATCH LOTE 4 — Entradas a adicionar em validation-map.ts
 *
 * Adicionar as entradas abaixo no objeto `infosimplesRequiredParams`
 * em validation-map.ts:
 *
 * // Portal Transparência
 * 'consultas/portal-transparencia/auxilio': ['data_inicio', 'data_fim'],
 * 'consultas/portal-transparencia/bolsa': ['data_inicio', 'data_fim'],
 * 'consultas/portal-transparencia/bpc': ['cpf'],
 * 'consultas/portal-transparencia/busca': ['query'],
 * 'consultas/portal-transparencia/ceaf': ['cpf'],
 * 'consultas/portal-transparencia/ceis': [{ oneOf: ['cpf', 'cnpj'] }],
 * 'consultas/portal-transparencia/cepim': ['cnpj'],
 * 'consultas/portal-transparencia/cnep': [{ oneOf: ['cpf', 'cnpj'] }],
 * 'consultas/portal-transparencia/convenios': ['convenente'],
 * 'consultas/portal-transparencia/leniencia': ['cnpj'],
 * 'consultas/portal-transparencia/peti': ['cpf'],
 * 'consultas/portal-transparencia/repasse': ['ano', 'localidade'],
 * 'consultas/portal-transparencia/safra': ['cpf'],
 * 'consultas/portal-transparencia/servidor': ['cpf'],
 * // seguro: sem parâmetros obrigatórios — não inserir entrada
 */

export {};
