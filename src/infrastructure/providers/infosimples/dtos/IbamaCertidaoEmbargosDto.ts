/**
 * @fileoverview DTO — IBAMA / Certidão de Embargos
 * Endpoint: POST consultas/ibama/certidao-embargos
 * @module infrastructure/providers/infosimples/dtos/IbamaCertidaoEmbargosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IbamaCertidaoEmbargosItemSchema = z
  .object({
    cpf_cnpj: z.string().optional(),
    nome: z.string().optional(),
    situacao: z.string().optional(),
    data_emissao: z.string().optional(),
    data_validade: z.string().optional(),
    numero_certidao: z.string().optional(),
    embargos: z.array(z.unknown()).optional(),
  })
  .passthrough();

export const IbamaCertidaoEmbargosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IbamaCertidaoEmbargosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IbamaCertidaoEmbargosItem = z.infer<typeof IbamaCertidaoEmbargosItemSchema>;
