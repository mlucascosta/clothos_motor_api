/**
 * @fileoverview DTO — MPF / Amazônia Protege
 * Endpoint: POST consultas/mpf/amazonia-protege
 * @module infrastructure/providers/infosimples/dtos/MpfAmazoniaProtegeDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const MpfAmazoniaProtegeItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  situacao: z.string().optional(),
  municipio: z.string().optional(),
  estado: z.string().optional(),
  data_inclusao: z.string().optional(),
  motivo: z.string().optional(),
}).passthrough();

export const MpfAmazoniaProtegeResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(MpfAmazoniaProtegeItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type MpfAmazoniaProtegeItem = z.infer<typeof MpfAmazoniaProtegeItemSchema>;
