/**
 * @fileoverview DTO — Antecedentes Criminais / PF Emissão
 * Endpoint: POST consultas/antecedentes-criminais/pf/emit
 * @module infrastructure/providers/infosimples/dtos/AntecedenteCriminaisPfEmitDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const AntecedenteCriminaisPfEmitItemSchema = z.object({
  nome: z.string().optional(),
  data_nascimento: z.string().optional(),
  certidao_codigo: z.string().optional(),
  certidao_validade: z.string().optional(),
  resultado: z.string().optional(),
  mensagem: z.string().optional(),
  url_certidao: z.string().optional(),
}).passthrough();

export const AntecedenteCriminaisPfEmitResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(AntecedenteCriminaisPfEmitItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type AntecedenteCriminaisPfEmitItem = z.infer<typeof AntecedenteCriminaisPfEmitItemSchema>;
