/**
 * @fileoverview DTO — Prefeitura SP / São Paulo / Dados Imóvel
 * Endpoint: POST consultas/pref/sp/sao-paulo/dados-imovel
 * @module infrastructure/providers/infosimples/dtos/PrefSpSaoPauloDadosImovelDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefSpSaoPauloDadosImovelItemSchema = z
  .object({
    cadastro_imovel: z.string().optional(),
    sql: z.string().optional(),
    ano_exercicio: z.string().optional(),
    endereco: z.string().optional(),
    bairro: z.string().optional(),
    proprietario: z.string().optional(),
    area_terreno: z.string().optional(),
    area_construida: z.string().optional(),
    uso: z.string().optional(),
    padrao: z.string().optional(),
    valor_venal_terreno: z.number().optional(),
    valor_venal_construcao: z.number().optional(),
    valor_venal_total: z.number().optional(),
    aliquota: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const PrefSpSaoPauloDadosImovelResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefSpSaoPauloDadosImovelItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefSpSaoPauloDadosImovelItem = z.infer<typeof PrefSpSaoPauloDadosImovelItemSchema>;
