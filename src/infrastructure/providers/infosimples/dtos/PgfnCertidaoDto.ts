/**
 * @fileoverview DTO — Certidão de Débitos Federais / Dívida Ativa da União (RFB/PGFN)
 * Endpoint: POST consultas/receita-federal/pgfn
 * @module infrastructure/providers/infosimples/dtos/PgfnCertidaoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PgfnCertidaoItemSchema = z
  .object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    nome: z.string().optional(),
    razao_social: z.string().optional(),
    tipo_certidao: z.string().optional(),
    situacao: z.string().optional(),
    codigo_controle: z.string().optional(),
    data_emissao: z.string().optional(),
    data_validade: z.string().optional(),
    observacoes: z.string().optional().nullable(),
  })
  .passthrough();

export const PgfnCertidaoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PgfnCertidaoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PgfnCertidaoItem = z.infer<typeof PgfnCertidaoItemSchema>;
export type PgfnCertidaoResponse = z.infer<typeof PgfnCertidaoResponseSchema>;
