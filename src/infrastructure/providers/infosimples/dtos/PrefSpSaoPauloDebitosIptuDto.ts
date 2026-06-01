/**
 * @fileoverview DTO — Prefeitura SP / São Paulo / Débitos IPTU
 * Endpoint: POST consultas/pref/sp/sao-paulo/debitos-iptu
 * @module infrastructure/providers/infosimples/dtos/PrefSpSaoPauloDebitosIptuDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefSpSaoPauloDebitosIptuItemSchema = z
  .object({
    cadastro_imovel: z.string().optional(),
    sql: z.string().optional(),
    endereco: z.string().optional(),
    debitos: z
      .array(
        z
          .object({
            exercicio: z.string().optional(),
            parcela: z.string().optional(),
            vencimento: z.string().optional(),
            valor_original: z.number().optional(),
            valor_atualizado: z.number().optional(),
            situacao: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    total_debitos: z.number().optional(),
  })
  .passthrough();

export const PrefSpSaoPauloDebitosIptuResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefSpSaoPauloDebitosIptuItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefSpSaoPauloDebitosIptuItem = z.infer<typeof PrefSpSaoPauloDebitosIptuItemSchema>;
