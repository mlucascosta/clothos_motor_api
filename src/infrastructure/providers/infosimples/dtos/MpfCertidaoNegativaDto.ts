/**
 * @fileoverview DTO — MPF / Certidão Negativa
 * Endpoint: POST consultas/mpf/certidao-negativa
 * @module infrastructure/providers/infosimples/dtos/MpfCertidaoNegativaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const MpfCertidaoNegativaItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  resultado: z.string().optional(),
  numero_certidao: z.string().optional(),
  data_emissao: z.string().optional(),
  data_validade: z.string().optional(),
  negativa: z.boolean().optional(),
}).passthrough();

export const MpfCertidaoNegativaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(MpfCertidaoNegativaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type MpfCertidaoNegativaItem = z.infer<typeof MpfCertidaoNegativaItemSchema>;
