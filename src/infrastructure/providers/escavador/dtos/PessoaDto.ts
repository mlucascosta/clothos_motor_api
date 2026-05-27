/**
 * @fileoverview DTOs de pessoa física e seus processos associados.
 * Define schemas Zod e tipos TypeScript para respostas de operações de pessoa.
 * @module infrastructure/providers/escavador/dtos/PessoaDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de pessoa física.
 * Retornado por ObterPessoa.
 * @type {ZodSchema}
 */
export const PessoaDtoSchema = z
  .object({
    id: z.number().int().positive(),
    nome: z.string().nullish(),
    quantidade_processos: z.number().int().min(0).nullish(),
  })
  .passthrough();

/**
 * Schema de processo resumido (sem detalhes completos).
 * Usado em listagens de processos de pessoa ou instituição.
 * @type {ZodSchema}
 */
export const ProcessoResumidoSchema = z.record(z.unknown());

/**
 * Schema de resposta de listagem de processos de uma pessoa.
 * @type {ZodSchema}
 */
export const PessoaProcessosResponseSchema = z.object({
  items: z.array(ProcessoResumidoSchema),
  paginator: z
    .object({
      total: z.number().int().nullish(),
      total_pages: z.number().int().nullish(),
      current_page: z.number().int().nullish(),
      per_page: z.number().int().nullish(),
    })
    .nullish(),
  links: z.object({ next: z.string().nullish(), prev: z.string().nullish() }).nullish(),
  total: z.number().int().min(0).nullish(),
});

/**
 * DTO de pessoa física com dados básicos.
 * @typedef {Object} PessoaDto
 */
export type PessoaDto = z.infer<typeof PessoaDtoSchema>;

/**
 * Processo jurídico em forma resumida (sem movimentações detalhadas).
 * @typedef {Object} ProcessoResumido
 */
export type ProcessoResumido = z.infer<typeof ProcessoResumidoSchema>;

/**
 * Resposta paginada de processos associados a uma pessoa.
 * @typedef {Object} PessoaProcessosResponse
 */
export type PessoaProcessosResponse = z.infer<typeof PessoaProcessosResponseSchema>;
