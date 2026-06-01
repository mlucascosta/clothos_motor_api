/**
 * @fileoverview DTO — Caixa / Regularidade
 * Endpoint: POST consultas/caixa/regularidade
 * @module infrastructure/providers/infosimples/dtos/CaixaRegularidadeDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CaixaRegularidadeItemSchema = z
  .object({
    cnpj: z.string().optional(),
    razao_social: z.string().optional(),
    situacao: z.string().optional(),
    situacao_descricao: z.string().optional(),
    data_situacao: z.string().optional(),
    data_consulta: z.string().optional(),
  })
  .passthrough();

export const CaixaRegularidadeResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CaixaRegularidadeItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CaixaRegularidadeItem = z.infer<typeof CaixaRegularidadeItemSchema>;
