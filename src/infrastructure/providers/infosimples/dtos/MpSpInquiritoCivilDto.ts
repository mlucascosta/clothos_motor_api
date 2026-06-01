/**
 * @fileoverview DTO — MP-SP / Inquérito Civil
 * Endpoint: POST consultas/mp/sp/inquerito-civil
 * @module infrastructure/providers/infosimples/dtos/MpSpInquiritoCivilDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const MpSpInquiritoCivilItemSchema = z
  .object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    nome: z.string().optional(),
    numero_inquerito: z.string().optional(),
    assunto: z.string().optional(),
    situacao: z.string().optional(),
    data_instauracao: z.string().optional(),
    promotoria: z.string().optional(),
    comarca: z.string().optional(),
  })
  .passthrough();

export const MpSpInquiritoCivilResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(MpSpInquiritoCivilItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type MpSpInquiritoCivilItem = z.infer<typeof MpSpInquiritoCivilItemSchema>;
