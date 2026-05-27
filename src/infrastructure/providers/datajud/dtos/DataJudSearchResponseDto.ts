/**
 * @fileoverview DTOs de response da API DataJud (Elasticsearch hits).
 * Schemas Zod para validação de respostas de busca.
 * @module infrastructure/providers/datajud/dtos/DataJudSearchResponseDto
 */

import { z } from 'zod';

/**
 * Schema de um hit do Elasticsearch retornado pelo DataJud.
 * O campo `_source` é genérico pois varia por tribunal.
 *
 * @type {ZodSchema}
 */
export const DataJudHitSchema = z.object({
  _index: z.string(),
  _type: z.string().optional(),
  _id: z.string(),
  _score: z.number().optional(),
  _source: z.record(z.unknown()),
  sort: z.array(z.unknown()).optional(),
});

export type DataJudHitDto = z.infer<typeof DataJudHitSchema>;

/**
 * Schema de response de busca genérica no DataJud.
 * Estrutura Elasticsearch padrão: took, timed_out, hits.
 *
 * @type {ZodSchema}
 */
export const DataJudSearchResponseSchema = z.object({
  took: z.number().int().min(0),
  timed_out: z.boolean(),
  hits: z.object({
    total: z.object({
      value: z.number().int().min(0),
      relation: z.string(),
    }),
    hits: z.array(DataJudHitSchema),
  }),
  _shards: z.record(z.unknown()).optional(),
  aggregations: z.record(z.unknown()).optional(),
});

export type DataJudSearchResponseDto = z.infer<typeof DataJudSearchResponseSchema>;
