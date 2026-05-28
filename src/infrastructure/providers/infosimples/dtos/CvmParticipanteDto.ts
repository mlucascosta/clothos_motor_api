/**
 * @fileoverview DTO — CVM / Participante
 * Endpoint: POST consultas/cvm/participante
 * @module infrastructure/providers/infosimples/dtos/CvmParticipanteDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CvmParticipanteItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  tipo_participante: z.string().optional(),
  categoria: z.string().optional(),
  situacao: z.string().optional(),
  data_registro: z.string().optional(),
  codigo_cvm: z.string().optional(),
}).passthrough();

export const CvmParticipanteResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CvmParticipanteItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CvmParticipanteItem = z.infer<typeof CvmParticipanteItemSchema>;
