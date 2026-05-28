/**
 * @fileoverview DTO — Diário Oficial SP / Valor Venal
 * Endpoint: POST consultas/diario-oficial/sp/valor-venal
 * @module infrastructure/providers/infosimples/dtos/DiarioOficialSpValorVenalDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const DiarioOficialSpValorVenalItemSchema = z.object({
  codigo_ipva: z.string().optional(),
  ano_fabricacao: z.string().optional(),
  placa: z.string().optional(),
  marca_modelo: z.string().optional(),
  valor_venal: z.number().optional(),
  ano_exercicio: z.string().optional(),
  data_publicacao: z.string().optional(),
}).passthrough();

export const DiarioOficialSpValorVenalResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(DiarioOficialSpValorVenalItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type DiarioOficialSpValorVenalItem = z.infer<typeof DiarioOficialSpValorVenalItemSchema>;
