/**
 * @fileoverview DTO — MPF / Lava Jato
 * Endpoint: POST consultas/mpf/lava-jato
 * @module infrastructure/providers/infosimples/dtos/MpfLavaJatoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const MpfLavaJatoItemSchema = z.object({
  nome: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  fase: z.string().optional(),
  descricao: z.string().optional(),
  data_operacao: z.string().optional(),
  numero_processo: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const MpfLavaJatoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(MpfLavaJatoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type MpfLavaJatoItem = z.infer<typeof MpfLavaJatoItemSchema>;
