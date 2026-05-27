/**
 * @fileoverview DTOs de resposta da operação "Busca Geral" do Escavador.
 * Define schemas de validação (Zod) e tipos TypeScript para resultado de busca.
 * @module infrastructure/providers/escavador/dtos/BuscaGeralDto
 */

import { z } from 'zod';

/**
 * Schema de um item de resultado de busca genérica.
 * Pode representar pessoa, instituição, processo ou advogado encontrado.
 *
 * @type {ZodSchema}
 */
export const BuscaResultItemSchema = z.object({
  /** ID único do resultado no Escavador */
  id: z.number().int().positive(),
  /** Nome da entidade encontrada */
  nome: z.string(),
  /** Tipo de entidade: pessoa física, empresa, processo ou advogado */
  tipo: z.enum(['pessoa', 'processo', 'instituicao', 'advogado']),
  /** CPF se tipo='pessoa' */
  cpf: z.string().optional(),
  /** CNPJ se tipo='instituicao' */
  cnpj: z.string().optional(),
  /** Número de registro na OAB se tipo='advogado' */
  oab: z.string().optional(),
  /** Contagem total de processos associados (se disponível) */
  quantidade_processos: z.number().int().min(0).optional(),
  /** URL para visualizar entidade no Escavador */
  url_escavador: z.string().optional(),
});

/**
 * Schema de resposta da operação "Busca Geral".
 * Contém array de resultados com paginação opcional.
 *
 * @type {ZodSchema}
 */
export const BuscaGeralResponseSchema = z.object({
  /** Array de itens encontrados */
  items: z.array(BuscaResultItemSchema),
  /** Total de resultados (pode diferir de items.length se paginado) */
  total: z.number().int().min(0).optional(),
  /** Página atual retornada */
  pagina: z.number().int().min(1).optional(),
  /** Total de páginas disponíveis */
  paginas: z.number().int().min(0).optional(),
});

/**
 * Um item de resultado de busca genérica.
 * Representa um resultado único encontrado na API Escavador.
 *
 * **Tipos de entidade:**
 * - `pessoa`: Pessoa física com CPF
 * - `instituicao`: Pessoa jurídica com CNPJ
 * - `processo`: Número de processo jurídico
 * - `advogado`: Profissional de direito com número OAB
 *
 * **Exemplo:**
 * ```typescript
 * const item: BuscaResultItem = {
 *   id: 12345,
 *   nome: "Acme Ltda",
 *   tipo: "instituicao",
 *   cnpj: "12.345.678/0001-99",
 *   quantidade_processos: 5,
 *   url_escavador: "https://escavador.com.br/instituicao/12345/"
 * };
 * ```
 *
 * @typedef {Object} BuscaResultItem
 */
export type BuscaResultItem = z.infer<typeof BuscaResultItemSchema>;

/**
 * Resposta completa da operação "Busca Geral" do Escavador.
 * Contém resultados de busca e informações de paginação.
 *
 * **Exemplo:**
 * ```typescript
 * const response: BuscaGeralResponse = {
 *   items: [
 *     { id: 1, nome: "Acme Ltd", tipo: "instituicao", cnpj: "..." },
 *     { id: 2, nome: "João Silva", tipo: "pessoa", cpf: "..." }
 *   ],
 *   total: 2,
 *   pagina: 1,
 *   paginas: 1
 * };
 * ```
 *
 * @typedef {Object} BuscaGeralResponse
 */
export type BuscaGeralResponse = z.infer<typeof BuscaGeralResponseSchema>;
