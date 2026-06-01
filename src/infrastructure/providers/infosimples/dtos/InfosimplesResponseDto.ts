/**
 * @fileoverview DTOs e schemas Zod para respostas da API Infosimples.
 * Estrutura genérica baseada no OpenAPI v2.2.35.
 * @module infrastructure/providers/infosimples/dtos/InfosimplesResponseDto
 */

import { z } from 'zod';

/**
 * Header presente em todas as respostas da API Infosimples.
 * Contém metadados sobre a consulta, billing, performance, etc.
 */
export const InfosimplesResponseHeaderSchema = z.object({
  api_version: z.string().optional(),
  api_version_full: z.string().optional(),
  product: z.string().optional(),
  service: z.string().optional(),
  parameters: z.record(z.unknown()).optional(),
  client_name: z.string().optional(),
  token_name: z.string().optional(),
  billable: z.boolean().optional(),
  price: z.number().optional(),
  requested_at: z.string().optional(),
  elapsed_time_in_milliseconds: z.number().optional(),
  remote_ip: z.string().optional(),
  signature: z.string().optional(),
});

export type InfosimplesResponseHeader = z.infer<typeof InfosimplesResponseHeaderSchema>;

/**
 * Schema genérico de resposta da API Infosimples.
 * Válido para TODAS as operações de consulta.
 *
 * @example
 * {
 *   "code": 0,
 *   "code_message": "OK",
 *   "header": { ... },
 *   "data_count": 1,
 *   "data": [ { ... } ],
 *   "errors": [],
 *   "site_receipts": []
 * }
 */
export const InfosimplesResponseSchema = z.object({
  code: z.number().describe('Código de resposta (0 = sucesso, >0 = erro)'),
  code_message: z.string().describe('Mensagem do código de resposta'),
  header: InfosimplesResponseHeaderSchema.describe('Metadados da requisição'),
  data_count: z.number().describe('Quantidade de itens em `data`'),
  data: z.array(z.unknown()).nullable().describe('Array de resultados ou null se nenhum resultado'),
  errors: z.array(z.string()).describe('Array de mensagens de erro (vazio se sucesso)'),
  site_receipts: z.array(z.string()).optional().describe('Comprovantes do site'),
});

export type InfosimplesResponse = z.infer<typeof InfosimplesResponseSchema>;
