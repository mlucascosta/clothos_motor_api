/**
 * @fileoverview DTOs de instituições (empresas) e pessoas vinculadas.
 * Define schemas Zod para respostas de operações sobre instituições.
 * @module infrastructure/providers/escavador/dtos/InstituicaoDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de instituição (empresa, órgão público, etc.).
 * Retornado por ObterInstituicao.
 * @type {ZodSchema}
 */
export const InstituicaoDtoSchema = z.object({
  /** ID único da instituição no Escavador */
  id: z.number().int().positive(),
  /** Nome da instituição */
  nome: z.string(),
  /** CNPJ da instituição (opcional) */
  cnpj: z.string().optional(),
  /** Tipo de instituição (ex: "Empresa", "Órgão Público") (opcional) */
  tipo: z.string().optional(),
  /** Total de processos judiciais associados (opcional) */
  quantidade_processos: z.number().int().min(0).optional(),
  /** URL do perfil no Escavador (opcional) */
  url_escavador: z.string().optional(),
});

/**
 * Schema de pessoa vinculada a uma instituição.
 * Representa relacionamento de trabalho ou vínculo administrativo.
 * @type {ZodSchema}
 */
export const InstituicaoPessoaSchema = z.object({
  /** ID único da pessoa no Escavador */
  id: z.number().int().positive(),
  /** Nome da pessoa */
  nome: z.string(),
  /** CPF da pessoa (opcional) */
  cpf: z.string().optional(),
  /** Cargo ou função exercida (opcional) */
  cargo: z.string().optional(),
  /** Data de entrada no cargo em formato ISO 8601 ou local (opcional) */
  data_entrada: z.string().optional(),
  /** Data de saída do cargo em formato ISO 8601 ou local (opcional, null se ainda ativo) */
  data_saida: z.string().optional(),
});

/**
 * Schema de resposta de listagem de pessoas vinculadas a instituição.
 * @type {ZodSchema}
 */
export const InstituicaoPessoasResponseSchema = z.object({
  /** Array de pessoas vinculadas */
  items: z.array(InstituicaoPessoaSchema),
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
 * DTO de instituição com dados básicos.
 * @typedef {Object} InstituicaoDto
 */
export type InstituicaoDto = z.infer<typeof InstituicaoDtoSchema>;

/**
 * Pessoa vinculada a uma instituição.
 * Pode ser funcionário, diretor, conselheiro, etc.
 * @typedef {Object} InstituicaoPessoa
 */
export type InstituicaoPessoa = z.infer<typeof InstituicaoPessoaSchema>;

/**
 * Resposta paginada de pessoas vinculadas a uma instituição.
 * @typedef {Object} InstituicaoPessoasResponse
 */
export type InstituicaoPessoasResponse = z.infer<typeof InstituicaoPessoasResponseSchema>;
