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
  id: z.number().int().positive().optional(),
  nome: z.string(),
  sigla: z.string().optional(),
  tipo: z.string().optional(),
  estado: z.string().optional(),
  ativo: z.boolean().optional(),
}).passthrough();

/**
 * Schema de resposta de listagem de tribunais.
 * Retornado por ListarTribunais.
 * @type {ZodSchema}
 */
export const ListarTribunaisResponseSchema = z.object({
  /** Array de tribunais */
  items: z.array(TribunalDtoSchema),
  paginator: z.object({
    total: z.number().int().nullish(),
    total_pages: z.number().int().nullish(),
    current_page: z.number().int().nullish(),
    per_page: z.number().int().nullish(),
  }).nullish(),
  links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
  total: z.number().int().nullish(),
});

/**
 * Schema de DTO de órgão administrativo.
 * Representa órgão público, ministério, secretaria, etc.
 * @type {ZodSchema}
 */
export const OrgaoAdministrativoSchema = z.object({
  id: z.number().int().positive().optional(),
  nome: z.string(),
  sigla: z.string().optional(),
  tipo: z.string().optional(),
}).passthrough();

/**
 * Schema de resposta de listagem de órgãos administrativos.
 * Retornado por ListarOrgaosAdministrativos.
 * @type {ZodSchema}
 */
export const ListarOrgaosResponseSchema = z.object({
  /** Array de órgãos administrativos */
  items: z.array(OrgaoAdministrativoSchema),
  paginator: z.object({
    total: z.number().int().nullish(),
    total_pages: z.number().int().nullish(),
    current_page: z.number().int().nullish(),
    per_page: z.number().int().nullish(),
  }).nullish(),
  links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
  total: z.number().int().nullish(),
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
