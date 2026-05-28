/**
 * @fileoverview DTO de movimentações processuais do Escavador.
 * Define schemas de validação (Zod) para eventos que ocorrem em processos.
 * @module infrastructure/providers/escavador/dtos/MovimentacaoDto
 */

import { z } from 'zod';

/**
 * Schema de uma movimentação processual individual.
 * Representa um evento que ocorreu no processo (sentença, apelação, etc.).
 *
 * @type {ZodSchema}
 */
export const MovimentacaoDtoSchema = z.object({
  id: z.number().int().optional(),
  data: z.string().nullish(),
  tipo: z.string().nullish(),
  descricao: z.string().nullish(),
  documento_url: z.string().nullish(),
}).passthrough();

/**
 * Schema de resposta com listagem de movimentações.
 * Retornado por operações de obtenção de movimentações de um processo.
 *
 * @type {ZodSchema}
 */
export const MovimentacoesResponseSchema = z.object({
  /** Array de movimentações do processo */
  items: z.array(MovimentacaoDtoSchema),
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
 * Uma movimentação processual individual.
 * Representa um evento que ocorreu em um processo jurídico.
 *
 * **Exemplo:**
 * ```typescript
 * const mov: MovimentacaoDto = {
 *   id: 999,
 *   data: "2026-05-20",
 *   tipo: "Sentença",
 *   descricao: "Sentença condenatória proferida pelo juiz",
 *   documento_url: "https://escavador.com.br/docs/..."
 * };
 * ```
 *
 * @typedef {Object} MovimentacaoDto
 */
export type MovimentacaoDto = z.infer<typeof MovimentacaoDtoSchema>;

/**
 * Resposta paginada de movimentações de um processo.
 *
 * @typedef {Object} MovimentacoesResponse
 */
export type MovimentacoesResponse = z.infer<typeof MovimentacoesResponseSchema>;
