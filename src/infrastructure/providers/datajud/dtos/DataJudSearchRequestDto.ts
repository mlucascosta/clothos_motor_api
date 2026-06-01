/**
 * @fileoverview DTOs de request para API DataJud (Elasticsearch DSL).
 * Schemas Zod para validação de bodies de busca.
 * @module infrastructure/providers/datajud/dtos/DataJudSearchRequestDto
 */

import { z } from 'zod';

/**
 * Schema de request genérico para busca DSL no DataJud.
 * Permite qualquer query DSL do Elasticsearch.
 *
 * @type {ZodSchema}
 */
export const DataJudSearchRequestSchema = z.object({
  /** Query DSL Elasticsearch (obrigatória) */
  query: z.record(z.unknown()),
  /** Tamanho da página (max 100) */
  size: z.number().int().min(1).max(100).optional().default(10),
  /** Offset para paginação */
  from: z.number().int().min(0).optional().default(0),
  /** Campos de ordenação */
  sort: z.array(z.record(z.unknown())).optional(),
  /** Projeção de campos (_source) */
  _source: z.union([z.boolean(), z.array(z.string())]).optional(),
  /** search_after para paginação profunda */
  search_after: z.array(z.unknown()).optional(),
});

export type DataJudSearchRequestDto = z.infer<typeof DataJudSearchRequestSchema>;

/**
 * Schema de request para busca por número de processo.
 *
 * @type {ZodSchema}
 */
export const DataJudProcessoRequestSchema = z.object({
  /** Número CNJ do processo (com ou sem formatação) */
  numeroProcesso: z.string().min(20).max(25),
  /** Tamanho da página */
  size: z.number().int().min(1).max(100).optional().default(1),
});

export type DataJudProcessoRequestDto = z.infer<typeof DataJudProcessoRequestSchema>;

/**
 * Schema de request para busca por classe processual.
 * Aceita nome (string) ou código numérico da TPU.
 *
 * @type {ZodSchema}
 */
export const DataJudClasseRequestSchema = z
  .object({
    /** Nome da classe processual */
    classeNome: z.string().min(1).optional(),
    /** Código numérico da classe (TPU) */
    classeCodigo: z.number().int().optional(),
    /** Tamanho da página */
    size: z.number().int().optional().default(20),
  })
  .refine((data) => data.classeNome !== undefined || data.classeCodigo !== undefined, {
    message: 'Informe classeNome ou classeCodigo',
  });

export type DataJudClasseRequestDto = z.infer<typeof DataJudClasseRequestSchema>;

/**
 * Schema de request para busca por órgão julgador.
 *
 * @type {ZodSchema}
 */
export const DataJudOrgaoRequestSchema = z.object({
  /** Nome do órgão julgador */
  orgaoJulgador: z.string().min(1),
  /** Tamanho da página */
  size: z.number().int().min(1).max(100).optional().default(20),
});

export type DataJudOrgaoRequestDto = z.infer<typeof DataJudOrgaoRequestSchema>;

/**
 * Schema de request para busca por envolvido.
 *
 * @type {ZodSchema}
 */
export const DataJudEnvolvidoRequestSchema = z.object({
  /** Nome do envolvido */
  nome: z.string().min(1).optional(),
  /** CPF ou CNPJ do envolvido */
  cpfCnpj: z.string().min(11).max(18).optional(),
  /** Tamanho da página */
  size: z.number().int().min(1).max(100).optional().default(20),
});

export type DataJudEnvolvidoRequestDto = z.infer<typeof DataJudEnvolvidoRequestSchema>;
