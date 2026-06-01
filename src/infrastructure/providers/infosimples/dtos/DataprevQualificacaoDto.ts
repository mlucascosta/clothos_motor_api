/**
 * @fileoverview DTO — Dataprev / Qualificação
 * Endpoint: POST consultas/dataprev/qualificacao
 * @module infrastructure/providers/infosimples/dtos/DataprevQualificacaoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const DataprevQualificacaoItemSchema = z
  .object({
    nis: z.string().optional(),
    cpf: z.string().optional(),
    nome: z.string().optional(),
    data_nascimento: z.string().optional(),
    resultado: z.string().optional(),
    resultado_descricao: z.string().optional(),
    data_consulta: z.string().optional(),
  })
  .passthrough();

export const DataprevQualificacaoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(DataprevQualificacaoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type DataprevQualificacaoItem = z.infer<typeof DataprevQualificacaoItemSchema>;
