/**
 * @fileoverview DTO — CADE / Processos
 * Endpoint: POST consultas/cade/processos
 * @module infrastructure/providers/infosimples/dtos/CadeProcessosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CadeProcessosItemSchema = z.object({
  numero_processo: z.string().optional(),
  tipo: z.string().optional(),
  assunto: z.string().optional(),
  situacao: z.string().optional(),
  data_autuacao: z.string().optional(),
  partes: z.array(z.object({
    nome: z.string().optional(),
    qualificacao: z.string().optional(),
  }).passthrough()).optional(),
  relator: z.string().optional(),
}).passthrough();

export const CadeProcessosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CadeProcessosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CadeProcessosItem = z.infer<typeof CadeProcessosItemSchema>;
