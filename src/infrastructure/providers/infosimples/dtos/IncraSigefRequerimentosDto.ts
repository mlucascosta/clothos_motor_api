/**
 * @fileoverview DTO — INCRA SIGEF / Requerimentos
 * Endpoint: POST consultas/incra/sigef/requerimentos
 * @module infrastructure/providers/infosimples/dtos/IncraSigefRequerimentosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IncraSigefRequerimentosItemSchema = z
  .object({
    numero_requerimento: z.string().optional(),
    tipo: z.string().optional(),
    situacao: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    area: z.number().optional(),
    requerente: z.string().optional(),
    data_requerimento: z.string().optional(),
  })
  .passthrough();

export const IncraSigefRequerimentosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IncraSigefRequerimentosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IncraSigefRequerimentosItem = z.infer<typeof IncraSigefRequerimentosItemSchema>;
