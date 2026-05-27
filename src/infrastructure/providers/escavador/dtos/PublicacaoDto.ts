/**
 * @fileoverview DTOs de publicações em diários oficiais.
 * Define schemas Zod para publicações encontradas na busca.
 * @module infrastructure/providers/escavador/dtos/PublicacaoDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de publicação em diário oficial.
 * Representa uma publicação encontrada pelo Escavador.
 * @type {ZodSchema}
 */
export const PublicacaoDtoSchema = z.object({
  /** ID único da publicação no Escavador (opcional) */
  id: z.number().int().optional(),
  /** Data de publicação no diário (ISO 8601 ou local) */
  data_publicacao: z.string(),
  /** Nome do diário oficial onde foi publicado (ex: "DOU", "DOESP") */
  diario: z.string(),
  /** Seção do diário (ex: "Seção 1", "Eletrônico") (opcional) */
  secao: z.string().optional(),
  /** Conteúdo/texto da publicação */
  conteudo: z.string(),
  /** URL da publicação original no diário (opcional) */
  url: z.string().optional(),
});

/**
 * Schema de resposta paginada de publicações.
 * @type {ZodSchema}
 */
export const PublicacoesResponseSchema = z.object({
  /** Array de publicações encontradas */
  items: z.array(PublicacaoDtoSchema),
  /** Total de publicações encontradas */
  total: z.number().int().min(0),
  /** Página atual retornada (opcional) */
  pagina: z.number().int().min(1).optional(),
  /** Total de páginas disponíveis (opcional) */
  paginas: z.number().int().min(0).optional(),
});

/**
 * DTO de publicação individual em diário oficial.
 * @typedef {Object} PublicacaoDto
 */
export type PublicacaoDto = z.infer<typeof PublicacaoDtoSchema>;

/**
 * Resposta paginada de publicações.
 * @typedef {Object} PublicacoesResponse
 */
export type PublicacoesResponse = z.infer<typeof PublicacoesResponseSchema>;
