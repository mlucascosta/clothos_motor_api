/**
 * @fileoverview DTO — IBAMA / Autuações
 * Endpoint: POST consultas/ibama/autuacoes
 * @module infrastructure/providers/infosimples/dtos/IbamaAutuacoesDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IbamaAutuacoesItemSchema = z
  .object({
    numero_auto: z.string().optional(),
    cpf_cnpj: z.string().optional(),
    nome: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    tipo_infracao: z.string().optional(),
    descricao: z.string().optional(),
    valor_multa: z.number().optional(),
    data_lavratura: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const IbamaAutuacoesResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IbamaAutuacoesItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IbamaAutuacoesItem = z.infer<typeof IbamaAutuacoesItemSchema>;
