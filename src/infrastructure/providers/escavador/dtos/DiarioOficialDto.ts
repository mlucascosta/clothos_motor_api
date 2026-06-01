/**
 * @fileoverview DTOs de diários oficiais (publicações em jornais de circulação oficial).
 * Define schemas Zod para origens de diários (estados e esferas).
 * @module infrastructure/providers/escavador/dtos/DiarioOficialDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de origem de diário oficial.
 * Representa estado ou esfera administrativa com diário ativo no Escavador.
 * @type {ZodSchema}
 */
export const DiarioOficialOrigemSchema = z
  .object({
    id: z.number().int().positive().optional(),
    nome: z.string(),
    sigla: z.string().optional(),
    estado: z.string().optional(),
    tipo: z.string().optional(),
    ativo: z.boolean().optional(),
  })
  .passthrough();

/**
 * Schema de resposta de listagem de origens de diários oficiais.
 * Retornado por ListarOrigensDiariosOficiais.
 * @type {ZodSchema}
 */
// API /api/v1/origens retorna array direto (não {items: []})
export const ListarOrigensDiariosResponseSchema = z.union([
  z.array(DiarioOficialOrigemSchema),
  z.object({
    items: z.array(DiarioOficialOrigemSchema),
    paginator: z
      .object({
        total: z.number().int().nullish(),
        total_pages: z.number().int().nullish(),
        current_page: z.number().int().nullish(),
        per_page: z.number().int().nullish(),
      })
      .nullish(),
    links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
    total: z.number().int().nullish(),
  }),
]);

/**
 * DTO de origem de diário oficial.
 * @typedef {Object} DiarioOficialOrigem
 */
export type DiarioOficialOrigem = z.infer<typeof DiarioOficialOrigemSchema>;

/**
 * Resposta de listagem de origens de diários oficiais.
 * @typedef {Object} ListarOrigensDiariosResponse
 */
export type ListarOrigensDiariosResponse = z.infer<typeof ListarOrigensDiariosResponseSchema>;
