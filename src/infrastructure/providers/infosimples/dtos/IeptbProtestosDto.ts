/**
 * @fileoverview DTO — IEPTB / Protestos
 * Endpoint: POST consultas/ieptb/protestos
 * @module infrastructure/providers/infosimples/dtos/IeptbProtestosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IeptbProtestosItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  quantidade_protestos: z.number().optional(),
  valor_total: z.number().optional(),
  obter_detalhes: z.string().optional().describe('Token para consulta de detalhes'),
  protestos: z.array(z.object({
    cartorio: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    data_protesto: z.string().optional(),
    valor: z.number().optional(),
  }).passthrough()).optional(),
}).passthrough();

export const IeptbProtestosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IeptbProtestosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IeptbProtestosItem = z.infer<typeof IeptbProtestosItemSchema>;
