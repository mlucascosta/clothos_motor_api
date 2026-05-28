/**
 * @fileoverview DTO — IEPTB / Protestos Detalhes SP
 * Endpoint: POST consultas/ieptb/protestos/detalhes-sp
 * @module infrastructure/providers/infosimples/dtos/IeptbProtestosDetalhesSpDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IeptbProtestosDetalhesSpItemSchema = z.object({
  numero_protocolo: z.string().optional(),
  data_protesto: z.string().optional(),
  valor: z.number().optional(),
  apresentante: z.string().optional(),
  cedente: z.string().optional(),
  especie: z.string().optional(),
  situacao: z.string().optional(),
  cartorio: z.string().optional(),
  cnpj_cartorio: z.string().optional(),
}).passthrough();

export const IeptbProtestosDetalhesSpResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IeptbProtestosDetalhesSpItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IeptbProtestosDetalhesSpItem = z.infer<typeof IeptbProtestosDetalhesSpItemSchema>;
