/**
 * @fileoverview DTO — Prefeitura SP / São Paulo / IPTU 2ª Via
 * Endpoint: POST consultas/pref/sp/sao-paulo/iptu2via
 * @module infrastructure/providers/infosimples/dtos/PrefSpSaoPauloIptu2viaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefSpSaoPauloIptu2viaItemSchema = z.object({
  sql: z.string().optional(),
  parcela: z.string().optional(),
  ano: z.string().optional(),
  endereco: z.string().optional(),
  vencimento: z.string().optional(),
  valor: z.number().optional(),
  codigo_barras: z.string().optional(),
  linha_digitavel: z.string().optional(),
  situacao: z.string().optional(),
  url_boleto: z.string().optional(),
}).passthrough();

export const PrefSpSaoPauloIptu2viaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefSpSaoPauloIptu2viaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefSpSaoPauloIptu2viaItem = z.infer<typeof PrefSpSaoPauloIptu2viaItemSchema>;
