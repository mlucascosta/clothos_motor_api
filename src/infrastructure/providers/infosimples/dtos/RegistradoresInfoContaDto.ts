/**
 * @fileoverview DTO — Registradores / Info Conta
 * Endpoint: POST consultas/registradores/info-conta
 * @module infrastructure/providers/infosimples/dtos/RegistradoresInfoContaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const RegistradoresInfoContaItemSchema = z
  .object({
    nome: z.string().optional(),
    cpf_cnpj: z.string().optional(),
    email: z.string().optional(),
    saldo: z.number().optional(),
    situacao: z.string().optional(),
    data_cadastro: z.string().optional(),
    ultimo_acesso: z.string().optional(),
  })
  .passthrough();

export const RegistradoresInfoContaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(RegistradoresInfoContaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type RegistradoresInfoContaItem = z.infer<typeof RegistradoresInfoContaItemSchema>;
