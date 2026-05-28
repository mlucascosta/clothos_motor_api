/**
 * @fileoverview DTO — SNCR / Imóveis
 * Endpoint: POST consultas/sncr/imoveis
 * @module infrastructure/providers/infosimples/dtos/SncrImoveisDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const SncrImoveisItemSchema = z.object({
  codigo_imovel: z.string().optional(),
  denominacao: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  area_total: z.number().optional(),
  tipo_imovel: z.string().optional(),
  proprietario: z.string().optional(),
  cpf_cnpj: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const SncrImoveisResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(SncrImoveisItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type SncrImoveisItem = z.infer<typeof SncrImoveisItemSchema>;
