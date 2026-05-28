/**
 * @fileoverview DTO — BCB / Cheques Sem Fundo
 * Endpoint: POST consultas/bcb/cheques-sem-fundo
 * @module infrastructure/providers/infosimples/dtos/BcbChequesSemFundoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const BcbChequesSemFundoItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  quantidade_ocorrencias: z.number().optional(),
  data_inclusao: z.string().optional(),
  motivo: z.string().optional(),
}).passthrough();

export const BcbChequesSemFundoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(BcbChequesSemFundoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type BcbChequesSemFundoItem = z.infer<typeof BcbChequesSemFundoItemSchema>;
