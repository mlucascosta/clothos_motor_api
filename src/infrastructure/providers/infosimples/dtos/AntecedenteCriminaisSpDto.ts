/**
 * @fileoverview DTO — Antecedentes Criminais / SP
 * Endpoint: POST consultas/antecedentes-criminais/sp
 * @module infrastructure/providers/infosimples/dtos/AntecedenteCriminaisSpDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const AntecedenteCriminaisSpItemSchema = z
  .object({
    nome: z.string().optional(),
    data_nascimento: z.string().optional(),
    genero: z.string().optional(),
    situacao: z.string().optional(),
    antecedentes: z
      .array(
        z
          .object({
            numero_processo: z.string().optional(),
            crime: z.string().optional(),
            data_fato: z.string().optional(),
            comarca: z.string().optional(),
            vara: z.string().optional(),
            situacao: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

export const AntecedenteCriminaisSpResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(AntecedenteCriminaisSpItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type AntecedenteCriminaisSpItem = z.infer<typeof AntecedenteCriminaisSpItemSchema>;
