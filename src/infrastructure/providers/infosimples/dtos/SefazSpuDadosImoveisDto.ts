/**
 * @fileoverview DTO — Sefaz SPU / Dados de Imóveis
 * Endpoint: POST consultas/sefaz/spu/dados-imoveis
 * @module infrastructure/providers/infosimples/dtos/SefazSpuDadosImoveisDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const SefazSpuDadosImoveisItemSchema = z
  .object({
    rip: z.string().optional(),
    denominacao: z.string().optional(),
    endereco: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    area_total: z.string().optional(),
    area_construida: z.string().optional(),
    uso: z.string().optional(),
    regime: z.string().optional(),
    valor_avaliacao: z.number().optional(),
    data_avaliacao: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const SefazSpuDadosImoveisResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(SefazSpuDadosImoveisItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type SefazSpuDadosImoveisItem = z.infer<typeof SefazSpuDadosImoveisItemSchema>;
