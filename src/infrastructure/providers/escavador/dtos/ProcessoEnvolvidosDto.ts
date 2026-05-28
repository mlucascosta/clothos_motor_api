/**
 * @fileoverview DTO de pessoas envolvidas em processo jurídico.
 * Define schemas Zod para listagem de envolvidos (autor, réu, etc.).
 * @module infrastructure/providers/escavador/dtos/ProcessoEnvolvidosDto
 */

import { z } from 'zod';

/**
 * Schema de resposta com listagem de pessoas envolvidas em processo.
 * Retorna lista de partes interessadas, advogados, etc.
 * @type {ZodSchema}
 */
export const ProcessoEnvolvidosResponseSchema = z.object({
  /** Array de pessoas envolvidas no processo (partes, advogados, etc.) */
  items: z.array(z.unknown()),
  total: z.number().nullish(),
  paginator: z.object({ total: z.number().nullish(), total_pages: z.number().nullish(), current_page: z.number().nullish(), per_page: z.number().nullish() }).nullish(),
  links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
});

/**
 * Resposta de listagem de pessoas envolvidas em processo.
 * @typedef {Object} ProcessoEnvolvidosResponse
 */
export type ProcessoEnvolvidosResponse = z.infer<typeof ProcessoEnvolvidosResponseSchema>;
