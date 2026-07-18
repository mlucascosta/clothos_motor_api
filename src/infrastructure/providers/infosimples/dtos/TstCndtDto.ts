/**
 * @fileoverview DTO — Certidão Negativa de Débitos Trabalhistas (TST / CNDT)
 * Endpoint: POST consultas/tst/cndt
 * @module infrastructure/providers/infosimples/dtos/TstCndtDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const TstCndtItemSchema = z
  .object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    nome: z.string().optional(),
    razao_social: z.string().optional(),
    situacao: z.string().optional(),
    numero_certidao: z.string().optional(),
    data_emissao: z.string().optional(),
    data_validade: z.string().optional(),
    observacoes: z.string().optional().nullable(),
  })
  .passthrough();

export const TstCndtResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(TstCndtItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type TstCndtItem = z.infer<typeof TstCndtItemSchema>;
export type TstCndtResponse = z.infer<typeof TstCndtResponseSchema>;
