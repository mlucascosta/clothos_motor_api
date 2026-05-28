/**
 * @fileoverview DTO — FGTS / Guia
 * Endpoint: POST consultas/fgts/guia
 * @module infrastructure/providers/infosimples/dtos/FgtsGuiaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const FgtsGuiaItemSchema = z.object({
  cnpj: z.string().optional(),
  competencia: z.string().optional(),
  codigo_recolhimento: z.string().optional(),
  valor: z.number().optional(),
  data_vencimento: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const FgtsGuiaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(FgtsGuiaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type FgtsGuiaItem = z.infer<typeof FgtsGuiaItemSchema>;
