/**
 * @fileoverview DTO — Fazenda / SPED
 * Endpoint: POST consultas/fazenda/sped
 * @module infrastructure/providers/infosimples/dtos/FazendaSpedDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const FazendaSpedItemSchema = z
  .object({
    cnpj: z.string().optional(),
    razao_social: z.string().optional(),
    situacao: z.string().optional(),
    data_situacao: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
  })
  .passthrough();

export const FazendaSpedResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(FazendaSpedItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type FazendaSpedItem = z.infer<typeof FazendaSpedItemSchema>;
