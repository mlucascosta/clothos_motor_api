/**
 * @fileoverview DTO — FGTS / Guia Rápida
 * Endpoint: POST consultas/fgts/guia-rapida
 * @module infrastructure/providers/infosimples/dtos/FgtsGuiaRapidaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const FgtsGuiaRapidaItemSchema = z.object({
  cnpj: z.string().optional(),
  competencia: z.string().optional(),
  codigo_recolhimento: z.string().optional(),
  valor: z.number().optional(),
  data_vencimento: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const FgtsGuiaRapidaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(FgtsGuiaRapidaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type FgtsGuiaRapidaItem = z.infer<typeof FgtsGuiaRapidaItemSchema>;
