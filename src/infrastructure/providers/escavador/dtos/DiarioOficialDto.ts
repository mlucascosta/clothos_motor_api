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
export const DiarioOficialOrigemSchema = z.object({
  /** ID único da origem no Escavador */
  id: z.number().int().positive(),
  /** Nome da origem (ex: "Diário Oficial do Estado de São Paulo") */
  nome: z.string(),
  /** Sigla da origem (ex: "DOESP", "DOU") (opcional) */
  sigla: z.string().optional(),
  /** UF de jurisdição (ex: "SP", "RJ", "BR" para federal) (opcional) */
  estado: z.string().optional(),
  /** Tipo de diário (ex: "Estadual", "Municipal", "Federal") (opcional) */
  tipo: z.string().optional(),
  /** Se diário está ativo para buscas (opcional, padrão true) */
  ativo: z.boolean().optional(),
});

/**
 * Schema de resposta de listagem de origens de diários oficiais.
 * Retornado por ListarOrigensDiariosOficiais.
 * @type {ZodSchema}
 */
export const ListarOrigensDiariosResponseSchema = z.object({
  /** Array de origens de diários */
  items: z.array(DiarioOficialOrigemSchema),
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
 * DTO de origem de diário oficial.
 * @typedef {Object} DiarioOficialOrigem
 */
export type DiarioOficialOrigem = z.infer<typeof DiarioOficialOrigemSchema>;

/**
 * Resposta de listagem de origens de diários oficiais.
 * @typedef {Object} ListarOrigensDiariosResponse
 */
export type ListarOrigensDiariosResponse = z.infer<typeof ListarOrigensDiariosResponseSchema>;
