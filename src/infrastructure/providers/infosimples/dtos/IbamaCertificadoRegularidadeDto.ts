/**
 * @fileoverview DTO — IBAMA / Certificado de Regularidade
 * Endpoint: POST consultas/ibama/certificado-regularidade
 * @module infrastructure/providers/infosimples/dtos/IbamaCertificadoRegularidadeDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IbamaCertificadoRegularidadeItemSchema = z
  .object({
    cpf_cnpj: z.string().optional(),
    nome: z.string().optional(),
    situacao: z.string().optional(),
    data_emissao: z.string().optional(),
    data_validade: z.string().optional(),
    numero_certificado: z.string().optional(),
  })
  .passthrough();

export const IbamaCertificadoRegularidadeResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IbamaCertificadoRegularidadeItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IbamaCertificadoRegularidadeItem = z.infer<
  typeof IbamaCertificadoRegularidadeItemSchema
>;
