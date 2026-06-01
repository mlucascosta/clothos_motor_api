/**
 * @fileoverview DTO — Antecedentes Criminais / MG
 * Endpoint: POST consultas/antecedentes-criminais/mg
 * @module infrastructure/providers/infosimples/dtos/AntecedenteCriminaisMgDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const AntecedenteCriminaisMgItemSchema = z
  .object({
    cpf: z.string().optional(),
    rg: z.string().optional(),
    nome: z.string().optional(),
    data_nascimento: z.string().optional(),
    sexo: z.string().optional(),
    situacao: z.string().optional(),
    antecedentes: z
      .array(
        z
          .object({
            numero_processo: z.string().optional(),
            crime: z.string().optional(),
            data_fato: z.string().optional(),
            comarca: z.string().optional(),
            situacao: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

export const AntecedenteCriminaisMgResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(AntecedenteCriminaisMgItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type AntecedenteCriminaisMgItem = z.infer<typeof AntecedenteCriminaisMgItemSchema>;
