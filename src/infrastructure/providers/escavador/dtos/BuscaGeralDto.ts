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
  id: z.number().int().positive(),
  nome: z.string().nullish(),
  tipo_resultado: z.string().nullish(),
  resumo: z.string().nullish(),
  quantidade_processos: z.number().int().min(0).nullish(),
  slug: z.string().nullish(),
  link: z.string().nullish(),
  link_api: z.string().nullish(),
  url_id: z.number().nullish(),
  oab_numero: z.string().nullish(),
  updated_at: z.string().nullish(),
}).passthrough();

/**
 * Schema de resposta da operação "Busca Geral".
 *
 * @type {ZodSchema}
 */
export const BuscaGeralResponseSchema = z.object({
  items: z.array(BuscaResultItemSchema),
  paginator: z
    .object({
      total: z.number().int().nullish(),
      total_pages: z.number().int().nullish(),
      current_page: z.number().int().nullish(),
      per_page: z.number().int().nullish(),
    })
    .nullish(),
  links: z
    .object({
      next: z.string().nullish(),
      prev: z.string().nullish(),
    })
    .nullish(),
  total: z.number().int().min(0).nullish(),
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
