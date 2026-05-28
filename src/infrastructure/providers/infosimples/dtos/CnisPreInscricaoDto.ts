/**
 * @fileoverview DTO — CNIS / Pré-inscrição
 * Endpoint: POST consultas/cnis/pre-inscricao
 * @module infrastructure/providers/infosimples/dtos/CnisPreInscricaoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CnisPreInscricaoItemSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  data_nascimento: z.string().optional(),
  nis: z.string().optional(),
  situacao: z.string().optional(),
  data_consulta: z.string().optional(),
}).passthrough();

export const CnisPreInscricaoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CnisPreInscricaoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CnisPreInscricaoItem = z.infer<typeof CnisPreInscricaoItemSchema>;
