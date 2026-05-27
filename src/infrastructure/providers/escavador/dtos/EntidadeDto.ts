/**
 * @fileoverview DTOs de entidades Escavador (pessoas, empresas, advogados, magistrados).
 * Define schemas de validação (Zod) para respostas da API.
 * @module infrastructure/providers/escavador/dtos/EntidadeDto
 */

import { z } from 'zod';

/**
 * Schema de uma entidade (pessoa, empresa, profissional jurídico).
 * Valida estrutura vinda da API Escavador.
 *
 * @type {ZodSchema}
 */
export const EntidadeDtoSchema = z.object({
  /** ID único no Escavador */
  id: z.number().int().positive(),
  /** Nome da entidade */
  nome: z.string(),
  /** Tipo de entidade */
  tipo: z.enum(['Pessoa', 'Empresa', 'Advogado', 'Desembargador', 'Juiz', 'Promotor']),
  /** CPF se tipo='Pessoa' */
  cpf: z.string().optional(),
  /** CNPJ se tipo='Empresa' */
  cnpj: z.string().optional(),
  /** Número OAB se tipo='Advogado' */
  oab: z.string().optional(),
  /** Total de processos associados */
  quantidade_processos: z.number().int().min(0).optional(),
  /** URL pública para visualizar entidade */
  url_escavador: z.string().optional(),
});

/**
 * Schema de resposta de busca de entidades.
 * Contém array de entidades com informações de paginação.
 *
 * @type {ZodSchema}
 */
export const BuscaEntidadeResponseSchema = z.object({
  /** Array de entidades encontradas */
  items: z.array(EntidadeDtoSchema),
  /** Total de resultados */
  total: z.number().int().min(0).optional(),
  /** Página atual */
  pagina: z.number().int().min(1).optional(),
  /** Total de páginas */
  paginas: z.number().int().min(0).optional(),
});

/**
 * DTO de uma entidade individual.
 * Representa pessoa, empresa, advogado, ou magistrado no Escavador.
 *
 * **Tipos de entidade:**
 * - `Pessoa`: Pessoa física com CPF
 * - `Empresa`: Pessoa jurídica com CNPJ
 * - `Advogado`: Profissional de direito com OAB
 * - `Desembargador`, `Juiz`, `Promotor`: Magistrados
 *
 * **Exemplo:**
 * ```typescript
 * const entidade: EntidadeDto = {
 *   id: 456,
 *   nome: "Acme Ltda",
 *   tipo: "Empresa",
 *   cnpj: "12.345.678/0001-99",
 *   quantidade_processos: 12,
 *   url_escavador: "https://escavador.com.br/empresa/456/"
 * };
 * ```
 *
 * @typedef {Object} EntidadeDto
 */
export type EntidadeDto = z.infer<typeof EntidadeDtoSchema>;

/**
 * Resposta de busca de entidades.
 * Contém lista de entidades encontradas com paginação.
 *
 * @typedef {Object} BuscaEntidadeResponse
 */
export type BuscaEntidadeResponse = z.infer<typeof BuscaEntidadeResponseSchema>;
