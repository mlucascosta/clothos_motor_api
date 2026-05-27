/**
 * @fileoverview DTOs de tribunais e órgãos administrativos.
 * Define schemas Zod para respostas de operações de tribunais e órgãos.
 * @module infrastructure/providers/escavador/dtos/TribunalDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de tribunal.
 * Representa corte ou tribunal judiciário.
 * Retornado por ListarTribunais e ObterTribunal.
 * @type {ZodSchema}
 */
export const TribunalDtoSchema = z.object({
  /** ID único do tribunal no Escavador */
  id: z.number().int().positive(),
  /** Nome completo do tribunal (ex: "Tribunal de Justiça do Estado de São Paulo") */
  nome: z.string(),
  /** Sigla do tribunal (ex: "TJSP", "STF", "TST") (opcional) */
  sigla: z.string().optional(),
  /** Tipo de tribunal (ex: "Estadual", "Federal", "Trabalhista") (opcional) */
  tipo: z.string().optional(),
  /** UF de jurisdição (ex: "SP", "RJ", "BR" para federais) (opcional) */
  estado: z.string().optional(),
  /** Se tribunal está ativo para consultas (opcional, padrão true) */
  ativo: z.boolean().optional(),
});

/**
 * Schema de resposta de listagem de tribunais.
 * Retornado por ListarTribunais.
 * @type {ZodSchema}
 */
export const ListarTribunaisResponseSchema = z.object({
  /** Array de tribunais */
  items: z.array(TribunalDtoSchema),
  /** Total de tribunais (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de DTO de órgão administrativo.
 * Representa órgão público, ministério, secretaria, etc.
 * @type {ZodSchema}
 */
export const OrgaoAdministrativoSchema = z.object({
  /** ID único do órgão no Escavador */
  id: z.number().int().positive(),
  /** Nome completo do órgão */
  nome: z.string(),
  /** Sigla do órgão (ex: "MP", "AGU", "INSS") (opcional) */
  sigla: z.string().optional(),
  /** Tipo de órgão (ex: "Ministério Público", "Autarquia") (opcional) */
  tipo: z.string().optional(),
});

/**
 * Schema de resposta de listagem de órgãos administrativos.
 * Retornado por ListarOrgaosAdministrativos.
 * @type {ZodSchema}
 */
export const ListarOrgaosResponseSchema = z.object({
  /** Array de órgãos administrativos */
  items: z.array(OrgaoAdministrativoSchema),
  /** Total de órgãos (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * DTO de tribunal (corte judiciária).
 * @typedef {Object} TribunalDto
 */
export type TribunalDto = z.infer<typeof TribunalDtoSchema>;

/**
 * Resposta de listagem de tribunais.
 * @typedef {Object} ListarTribunaisResponse
 */
export type ListarTribunaisResponse = z.infer<typeof ListarTribunaisResponseSchema>;

/**
 * DTO de órgão administrativo (ministério, secretaria, etc.).
 * @typedef {Object} OrgaoAdministrativo
 */
export type OrgaoAdministrativo = z.infer<typeof OrgaoAdministrativoSchema>;

/**
 * Resposta de listagem de órgãos administrativos.
 * @typedef {Object} ListarOrgaosResponse
 */
export type ListarOrgaosResponse = z.infer<typeof ListarOrgaosResponseSchema>;
