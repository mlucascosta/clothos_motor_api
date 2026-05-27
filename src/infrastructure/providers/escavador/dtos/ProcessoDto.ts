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
export const ProcessoDtoSchema = z.object({
  /** ID único do processo no Escavador (opcional) */
  id: z.number().int().optional(),
  /** Número CNJ do processo (identificador nacional) */
  numero_cnj: z.string(),
  /** Nome do tribunal (ex: "TJSP", "TST") */
  tribunal: z.string(),
  /** Data de ajuizamento em formato ISO 8601 ou local (opcional) */
  data_ajuizamento: z.string().optional(),
  /** Tipo de ação judicial (ex: "Ação Ordinária", "Recurso") (opcional) */
  tipo_acao: z.string().optional(),
  /** Valor da causa em reais (opcional) */
  valor_causa: z.number().optional(),
  /** Se processo está ativo (não encerrado) (opcional, padrão true) */
  ativo: z.boolean().optional(),
  /** Descrição ou data da última movimentação (opcional) */
  ultima_movimentacao: z.string().optional(),
  /** Array de partes envolvidas (opcional, padrão []) */
  partes: z.array(ParteDtoSchema).optional().default([]),
});

/**
 * Schema de resposta de listagem de processos de uma entidade (pessoa ou instituição).
 * @type {ZodSchema}
 */
export const ProcessosEntidadeResponseSchema = z.object({
  /** Array de processos com detalhes completos */
  items: z.array(ProcessoDtoSchema),
  /** Total de processos encontrados */
  total: z.number().int().min(0),
  /** Página atual retornada (opcional) */
  pagina: z.number().int().min(1).optional(),
  /** Total de páginas disponíveis (opcional) */
  paginas: z.number().int().min(0).optional(),
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
