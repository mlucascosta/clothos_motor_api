/**
 * @fileoverview DTOs de processo jurídico completo com partes envolvidas.
 * Define schemas Zod e tipos TypeScript para respostas de operações de processo.
 * @module infrastructure/providers/escavador/dtos/ProcessoDto
 */

import { z } from 'zod';

/**
 * Schema de parte envolvida em processo jurídico.
 * Representa um participante (autor, réu, terceiro, etc.).
 * @type {ZodSchema}
 */
export const ParteDtoSchema = z.object({
  /** ID único da parte no Escavador (opcional) */
  id: z.number().int().optional(),
  /** Nome da parte (pessoa física ou jurídica) */
  nome: z.string(),
  /** Classificação no processo (ex: "Autor", "Réu", "Terceiro") */
  tipo_parte: z.string(),
  /** Advogados que representam a parte (opcional, padrão []) */
  advogados: z
    .array(z.object({ nome: z.string(), oab: z.string().optional() }))
    .optional()
    .default([]),
});

/**
 * Schema de DTO completo de processo jurídico.
 * Inclui partes, datas e informações de movimentação.
 * @type {ZodSchema}
 */
export const ProcessoDtoSchema = z
  .object({
    /** ID único do processo no Escavador (opcional) */
    id: z.number().int().nullish(),
    /** Número CNJ do processo (identificador nacional) */
    numero_cnj: z.string().nullish(),
    /** Número novo do processo */
    numero_novo: z.string().nullish(),
    /** Nome do tribunal (ex: "TJSP", "TST") */
    tribunal: z.string().nullish(),
    /** Data de ajuizamento em formato ISO 8601 ou local (opcional) */
    data_ajuizamento: z.string().nullish(),
    /** Tipo de ação judicial (ex: "Ação Ordinária", "Recurso") (opcional) */
    tipo_acao: z.string().nullish(),
    /** Valor da causa em reais (opcional) */
    valor_causa: z.number().nullish(),
    /** Se processo está ativo (não encerrado) (opcional) */
    ativo: z.boolean().nullish(),
    /** Descrição ou data da última movimentação (opcional) */
    ultima_movimentacao: z.string().nullish(),
    /** Array de partes envolvidas (opcional) */
    partes: z.array(ParteDtoSchema).nullish(),
  })
  .passthrough();

/**
 * Schema de resposta de listagem de processos de uma entidade (pessoa ou instituição).
 * @type {ZodSchema}
 */
export const ProcessosEntidadeResponseSchema = z.object({
  /** Array de processos com detalhes completos */
  items: z.array(ProcessoDtoSchema),
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
});

/**
 * Parte envolvida em processo jurídico.
 * Pode ser autor, réu, terceiro, etc.
 * @typedef {Object} ParteDto
 */
export type ParteDto = z.infer<typeof ParteDtoSchema>;

/**
 * DTO completo de processo jurídico com partes, datas e movimentações.
 * @typedef {Object} ProcessoDto
 */
export type ProcessoDto = z.infer<typeof ProcessoDtoSchema>;

/**
 * Resposta paginada de processos associados a uma entidade.
 * @typedef {Object} ProcessosEntidadeResponse
 */
export type ProcessosEntidadeResponse = z.infer<typeof ProcessosEntidadeResponseSchema>;
