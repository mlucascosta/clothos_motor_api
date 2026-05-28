/**
 * @fileoverview DTO — CVM / Sancionadores
 * Endpoint: POST consultas/cvm/sancionadores
 * @module infrastructure/providers/infosimples/dtos/CvmSancionadoresDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CvmSancionadoresItemSchema = z.object({
  nome: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  penalidade: z.string().optional(),
  valor_multa: z.number().optional(),
  data_julgamento: z.string().optional(),
  numero_processo: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const CvmSancionadoresResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CvmSancionadoresItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CvmSancionadoresItem = z.infer<typeof CvmSancionadoresItemSchema>;
