/**
 * @fileoverview DTO — Prefeitura SP / São Paulo / IPTU
 * Endpoint: POST consultas/pref/sp/sao-paulo/iptu
 * @module infrastructure/providers/infosimples/dtos/PrefSpSaoPauloIptuDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefSpSaoPauloIptuItemSchema = z.object({
  sql: z.string().optional(),
  endereco: z.string().optional(),
  proprietario: z.string().optional(),
  area_terreno: z.string().optional(),
  area_construida: z.string().optional(),
  valor_venal: z.number().optional(),
  ano: z.string().optional(),
  parcelas: z.array(z.object({
    parcela: z.string().optional(),
    vencimento: z.string().optional(),
    valor: z.number().optional(),
    situacao: z.string().optional(),
    codigo_barras: z.string().optional(),
  }).passthrough()).optional(),
  situacao: z.string().optional(),
}).passthrough();

export const PrefSpSaoPauloIptuResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefSpSaoPauloIptuItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefSpSaoPauloIptuItem = z.infer<typeof PrefSpSaoPauloIptuItemSchema>;
