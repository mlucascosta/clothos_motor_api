/**
 * @fileoverview DTO — INCRA SIGEF / Parcelas
 * Endpoint: POST consultas/incra/sigef/parcelas
 * @module infrastructure/providers/infosimples/dtos/IncraSigefParcelasDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IncraSigefParcelasItemSchema = z.object({
  codigo_parcela: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  area: z.number().optional(),
  situacao: z.string().optional(),
  proprietario: z.string().optional(),
  cpf_cnpj: z.string().optional(),
}).passthrough();

export const IncraSigefParcelasResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IncraSigefParcelasItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IncraSigefParcelasItem = z.infer<typeof IncraSigefParcelasItemSchema>;
