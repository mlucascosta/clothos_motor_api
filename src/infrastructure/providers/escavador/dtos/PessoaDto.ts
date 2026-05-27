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
export const PessoaDtoSchema = z.object({
  /** ID único da pessoa no Escavador */
  id: z.number().int().positive(),
  /** Nome completo da pessoa */
  nome: z.string(),
  /** CPF (opcional, pode ser mascarado ou omitido por privacidade) */
  cpf: z.string().optional(),
  /** Data de nascimento em formato ISO 8601 ou local (opcional) */
  data_nascimento: z.string().optional(),
  /** Sexo: M=Masculino, F=Feminino, O=Outro (opcional) */
  sexo: z.enum(['M', 'F', 'O']).optional(),
  /** Contagem total de processos associados (opcional) */
  quantidade_processos: z.number().int().min(0).optional(),
  /** URL do perfil no Escavador (opcional) */
  url_escavador: z.string().optional(),
});

/**
 * Schema de processo resumido (sem detalhes completos).
 * Usado em listagens de processos de pessoa ou instituição.
 * @type {ZodSchema}
 */
export const ProcessoResumidoSchema = z.object({
  /** ID único do processo no Escavador */
  id: z.number().int().positive(),
  /** Número CNJ do processo (identificador nacional) */
  numero_cnj: z.string(),
  /** Nome do tribunal (ex: "TJSP", "TST") */
  tribunal: z.string(),
  /** Data de ajuizamento (opcional) */
  data_ajuizamento: z.string().optional(),
  /** Tipo de ação judicial (ex: "Ação Ordinária", "Recurso") (opcional) */
  tipo_acao: z.string().optional(),
  /** Se processo está ativo (não encerrado) (opcional, padrão true) */
  ativo: z.boolean().optional(),
  /** Descrição ou data da última movimentação (opcional) */
  ultima_movimentacao: z.string().optional(),
});

/**
 * Schema de resposta de listagem de processos de uma pessoa.
 * @type {ZodSchema}
 */
export const PessoaProcessosResponseSchema = z.object({
  /** Array de processos resumidos */
  items: z.array(ProcessoResumidoSchema),
  /** Total de processos encontrados */
  total: z.number().int().min(0),
  /** Página atual retornada (opcional) */
  pagina: z.number().int().min(1).optional(),
  /** Total de páginas disponíveis (opcional) */
  paginas: z.number().int().min(0).optional(),
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
