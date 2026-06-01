/**
 * @fileoverview DTO — Antecedentes Criminais / PF Validação
 * Endpoint: POST consultas/antecedentes-criminais/pf/val
 * @module infrastructure/providers/infosimples/dtos/AntecedenteCriminaisPfValDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const AntecedenteCriminaisPfValItemSchema = z
  .object({
    certidao_codigo: z.string().optional(),
    data_nascimento: z.string().optional(),
    nome: z.string().optional(),
    resultado: z.string().optional(),
    valida: z.boolean().optional(),
    mensagem: z.string().optional(),
  })
  .passthrough();

export const AntecedenteCriminaisPfValResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(AntecedenteCriminaisPfValItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type AntecedenteCriminaisPfValItem = z.infer<typeof AntecedenteCriminaisPfValItemSchema>;
