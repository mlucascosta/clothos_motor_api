/**
 * @fileoverview DTO — Dataprev / FAP
 * Endpoint: POST consultas/dataprev/fap
 * @module infrastructure/providers/infosimples/dtos/DataprevFapDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const DataprevFapItemSchema = z.object({
  cnpj_estabelecimento: z.string().optional(),
  razao_social: z.string().optional(),
  ano_vigencia: z.string().optional(),
  fap: z.number().optional(),
  fap_descricao: z.string().optional(),
  resultado: z.string().optional(),
  bonus_malus: z.string().optional(),
  data_consulta: z.string().optional(),
}).passthrough();

export const DataprevFapResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(DataprevFapItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type DataprevFapItem = z.infer<typeof DataprevFapItemSchema>;
