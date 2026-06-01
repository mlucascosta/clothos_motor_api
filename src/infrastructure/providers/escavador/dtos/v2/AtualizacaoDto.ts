/**
 * @fileoverview DTOs de atualização de processos em lote (API Escavador v2).
 * Define schemas para processamento assíncrono de atualização de dados processuais.
 * @module infrastructure/providers/escavador/dtos/v2/AtualizacaoDto
 */

import { z } from 'zod';

/**
 * Status possível de uma atualização.
 * @type {ZodSchema}
 */
export const AtualizacaoStatusSchema = z.enum(['pendente', 'em_andamento', 'concluido', 'erro']);

/**
 * Schema de atualização em lote.
 * Representa requisição para atualizar múltiplos processos.
 *
 * @type {ZodSchema}
 */
export const AtualizacaoLoteDtoSchema = z.object({
  /** ID único da requisição de atualização em lote */
  id: z.number().int(),
  /** Status do processamento do lote */
  status: AtualizacaoStatusSchema,
  /** Total de processos no lote (opcional) */
  total: z.number().int().optional(),
  /** Quantidade de processos já processados (opcional) */
  processados: z.number().int().optional(),
  /** Timestamp ISO 8601 de criação da requisição */
  criado_em: z.string().optional(),
});

/**
 * Schema de atualização de processo individual.
 * Representa requisição para atualizar um processo específico.
 *
 * @type {ZodSchema}
 */
export const AtualizacaoProcessoDtoSchema = z
  .object({
    id: z.number().int().optional(),
    status: AtualizacaoStatusSchema.optional(),
    numero_cnj: z.string().optional(),
    processo_id: z.number().int().optional(),
    criado_em: z.string().nullish(),
    data_ultima_verificacao: z.string().nullish(),
    tempo_desde_ultima_verificacao: z.string().nullish(),
    ultima_verificacao: z.unknown().optional(),
  })
  .passthrough();

/**
 * Status de uma operação de atualização.
 * @typedef {'pendente' | 'em_andamento' | 'concluido' | 'erro'} AtualizacaoStatus
 */
export type AtualizacaoStatus = z.infer<typeof AtualizacaoStatusSchema>;

/**
 * Requisição de atualização de múltiplos processos.
 * Usado para atualizar dados de lotes de processos de forma assíncrona.
 *
 * @typedef {Object} AtualizacaoLoteDto
 */
export type AtualizacaoLoteDto = z.infer<typeof AtualizacaoLoteDtoSchema>;

/**
 * Requisição de atualização de um processo.
 * Solicita atualização dos dados de um processo específico.
 *
 * @typedef {Object} AtualizacaoProcessoDto
 */
export type AtualizacaoProcessoDto = z.infer<typeof AtualizacaoProcessoDtoSchema>;
