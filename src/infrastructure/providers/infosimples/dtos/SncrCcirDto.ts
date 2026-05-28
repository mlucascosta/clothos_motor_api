/**
 * @fileoverview DTO — SNCR / CCIR
 * Endpoint: POST consultas/sncr/ccir
 * @module infrastructure/providers/infosimples/dtos/SncrCcirDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const SncrCcirItemSchema = z.object({
  codigo_imovel: z.string().optional(),
  denominacao: z.string().optional(),
  municipio_sede: z.string().optional(),
  uf_sede: z.string().optional(),
  area_total: z.number().optional(),
  tipo_imovel: z.string().optional(),
  proprietario: z.string().optional(),
  cpf_cnpj: z.string().optional(),
  numero_certificacao: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const SncrCcirResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(SncrCcirItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type SncrCcirItem = z.infer<typeof SncrCcirItemSchema>;
