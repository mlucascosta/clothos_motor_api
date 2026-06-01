/**
 * @fileoverview DTOs de tribunais e sistemas judiciais (API Escavador v2).
 * Define schemas Zod para tribunais e classificação de sistemas.
 * @module infrastructure/providers/escavador/dtos/v2/TribunalV2Dto
 */

import { z } from 'zod';

/**
 * Schema de DTO de sistema judicial.
 * Classificação de tribunal (STF, TJSP, TRT, etc.).
 * @type {ZodSchema}
 */
export const SistemaJudicialSchema = z
  .object({
    id: z.number().int().optional(),
    nome: z.string().optional(),
    sigla: z.string().optional(),
    sistema_nome: z.string().optional(),
    tribunal_sigla: z.string().optional(),
    tribunal_nome: z.string().optional(),
  })
  .passthrough();

/**
 * Schema de resposta de listagem de sistemas judiciais.
 * @type {ZodSchema}
 */
export const ListarSistemasResponseSchema = z.object({
  /** Array de sistemas judiciais */
  items: z.array(SistemaJudicialSchema),
  /** Total de sistemas (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Schema de DTO de tribunal (API v2).
 * Representa uma corte específica dentro de um sistema judicial.
 * @type {ZodSchema}
 */
export const TribunalV2DtoSchema = z.object({
  /** ID único do tribunal */
  id: z.number().int(),
  /** Nome completo do tribunal */
  nome: z.string(),
  /** Sigla (ex: "TJSP", "STF") (opcional) */
  sigla: z.string().optional(),
  /** ID do sistema judicial ao qual pertence (opcional) */
  sistema_id: z.number().int().optional(),
});

/**
 * Schema de resposta de listagem de tribunais (API v2).
 * @type {ZodSchema}
 */
export const ListarTribunaisV2ResponseSchema = z.object({
  /** Array de tribunais */
  items: z.array(TribunalV2DtoSchema),
  /** Total de tribunais (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * DTO de sistema judicial.
 * @typedef {Object} SistemaJudicial
 */
export type SistemaJudicial = z.infer<typeof SistemaJudicialSchema>;

/**
 * Resposta de listagem de sistemas judiciais.
 * @typedef {Object} ListarSistemasResponse
 */
export type ListarSistemasResponse = z.infer<typeof ListarSistemasResponseSchema>;

/**
 * DTO de tribunal (API v2).
 * @typedef {Object} TribunalV2Dto
 */
export type TribunalV2Dto = z.infer<typeof TribunalV2DtoSchema>;

/**
 * Resposta de listagem de tribunais (API v2).
 * @typedef {Object} ListarTribunaisV2Response
 */
export type ListarTribunaisV2Response = z.infer<typeof ListarTribunaisV2ResponseSchema>;
