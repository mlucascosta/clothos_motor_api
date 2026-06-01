/**
 * @fileoverview DTO — INCRA SIGEF / Detalhes Parcela
 * Endpoint: POST consultas/incra/sigef/detalhes-parcela
 * @module infrastructure/providers/infosimples/dtos/IncraSigefDetalhesParcelaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IncraSigefDetalhesParcelaItemSchema = z
  .object({
    codigo_parcela: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    area: z.number().optional(),
    situacao: z.string().optional(),
    proprietario: z.string().optional(),
    cpf_cnpj: z.string().optional(),
    data_certificacao: z.string().optional(),
  })
  .passthrough();

export const IncraSigefDetalhesParcelaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IncraSigefDetalhesParcelaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IncraSigefDetalhesParcelaItem = z.infer<typeof IncraSigefDetalhesParcelaItemSchema>;
