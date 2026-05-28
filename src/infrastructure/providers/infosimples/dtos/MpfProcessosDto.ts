/**
 * @fileoverview DTO — MPF / Processos
 * Endpoint: POST consultas/mpf/processos
 * @module infrastructure/providers/infosimples/dtos/MpfProcessosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const MpfProcessosItemSchema = z.object({
  numero_processo: z.string().optional(),
  assunto: z.string().optional(),
  situacao: z.string().optional(),
  data_autuacao: z.string().optional(),
  classe: z.string().optional(),
  orgao: z.string().optional(),
  partes: z.array(z.object({
    nome: z.string().optional(),
    tipo: z.string().optional(),
  }).passthrough()).optional(),
}).passthrough();

export const MpfProcessosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(MpfProcessosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type MpfProcessosItem = z.infer<typeof MpfProcessosItemSchema>;
