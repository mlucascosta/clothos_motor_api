/**
 * @fileoverview DTO — Prefeitura MG / Belo Horizonte / IPTU
 * Endpoint: POST consultas/pref/mg/belo-horizonte/iptu
 * @module infrastructure/providers/infosimples/dtos/PrefMgBeloHorizonteIptuDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefMgBeloHorizonteIptuItemSchema = z
  .object({
    identificador: z.string().optional(),
    inscricao: z.string().optional(),
    endereco: z.string().optional(),
    area: z.string().optional(),
    valor_venal: z.number().optional(),
    ano: z.string().optional(),
    parcelas: z
      .array(
        z
          .object({
            parcela: z.string().optional(),
            vencimento: z.string().optional(),
            valor: z.number().optional(),
            situacao: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const PrefMgBeloHorizonteIptuResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefMgBeloHorizonteIptuItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefMgBeloHorizonteIptuItem = z.infer<typeof PrefMgBeloHorizonteIptuItemSchema>;
