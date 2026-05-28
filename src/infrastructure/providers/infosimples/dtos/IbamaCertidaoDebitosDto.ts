/**
 * @fileoverview DTO — IBAMA / Certidão de Débitos
 * Endpoint: POST consultas/ibama/certidao-debitos
 * @module infrastructure/providers/infosimples/dtos/IbamaCertidaoDebitosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IbamaCertidaoDebitosItemSchema = z.object({
  cpf_cnpj: z.string().optional(),
  nome: z.string().optional(),
  situacao: z.string().optional(),
  data_emissao: z.string().optional(),
  data_validade: z.string().optional(),
  numero_certidao: z.string().optional(),
}).passthrough();

export const IbamaCertidaoDebitosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IbamaCertidaoDebitosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IbamaCertidaoDebitosItem = z.infer<typeof IbamaCertidaoDebitosItemSchema>;
