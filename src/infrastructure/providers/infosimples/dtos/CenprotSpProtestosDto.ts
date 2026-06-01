/**
 * @fileoverview DTO — CENPROT-SP / Protestos
 * Endpoint: POST consultas/cenprot-sp/protestos
 * @module infrastructure/providers/infosimples/dtos/CenprotSpProtestosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CenprotSpProtestosItemSchema = z
  .object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    nome: z.string().optional(),
    quantidade_protestos: z.number().optional(),
    valor_total: z.number().optional(),
    protestos: z
      .array(
        z
          .object({
            cartorio: z.string().optional(),
            data_protesto: z.string().optional(),
            valor: z.number().optional(),
            numero_protocolo: z.string().optional(),
            situacao: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

export const CenprotSpProtestosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CenprotSpProtestosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CenprotSpProtestosItem = z.infer<typeof CenprotSpProtestosItemSchema>;
