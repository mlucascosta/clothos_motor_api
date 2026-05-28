/**
 * @fileoverview DTO — Prefeitura SP / Campinas / IPTU
 * Endpoint: POST consultas/pref/sp/campinas/iptu
 * @module infrastructure/providers/infosimples/dtos/PrefSpCampinasIptuDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefSpCampinasIptuItemSchema = z.object({
  codigo_cartografico: z.string().optional(),
  nome_devedor: z.string().optional(),
  endereco: z.string().optional(),
  area_terreno: z.string().optional(),
  area_construida: z.string().optional(),
  valor_venal: z.number().optional(),
  ano: z.string().optional(),
  parcelas: z.array(z.object({
    parcela: z.string().optional(),
    vencimento: z.string().optional(),
    valor: z.number().optional(),
    situacao: z.string().optional(),
  }).passthrough()).optional(),
  situacao: z.string().optional(),
}).passthrough();

export const PrefSpCampinasIptuResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefSpCampinasIptuItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefSpCampinasIptuItem = z.infer<typeof PrefSpCampinasIptuItemSchema>;
