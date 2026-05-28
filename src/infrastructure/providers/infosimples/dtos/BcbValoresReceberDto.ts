/**
 * @fileoverview DTO — BCB / Valores a Receber
 * Endpoint: POST consultas/bcb/valores-receber
 * @module infrastructure/providers/infosimples/dtos/BcbValoresReceberDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const BcbValoresReceberItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  valor_total: z.number().optional(),
  quantidade_contas: z.number().optional(),
  contas: z.array(z.object({
    banco: z.string().optional(),
    agencia: z.string().optional(),
    tipo_conta: z.string().optional(),
    valor: z.number().optional(),
    situacao: z.string().optional(),
  }).passthrough()).optional(),
}).passthrough();

export const BcbValoresReceberResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(BcbValoresReceberItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type BcbValoresReceberItem = z.infer<typeof BcbValoresReceberItemSchema>;
