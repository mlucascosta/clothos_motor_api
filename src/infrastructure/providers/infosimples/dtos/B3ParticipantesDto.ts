/**
 * @fileoverview DTO — B3 / Participantes
 * Endpoint: POST consultas/b3/participantes
 * @module infrastructure/providers/infosimples/dtos/B3ParticipantesDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const B3ParticipantesItemSchema = z.object({
  cnpj: z.string().optional(),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  tipo_participante: z.string().optional(),
  categoria: z.string().optional(),
  situacao: z.string().optional(),
  data_autorizacao: z.string().optional(),
  mercados: z.array(z.string()).optional(),
}).passthrough();

export const B3ParticipantesResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(B3ParticipantesItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type B3ParticipantesItem = z.infer<typeof B3ParticipantesItemSchema>;
