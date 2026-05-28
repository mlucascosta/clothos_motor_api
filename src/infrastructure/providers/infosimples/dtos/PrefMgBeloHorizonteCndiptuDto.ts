/**
 * @fileoverview DTO — Prefeitura MG / Belo Horizonte / CND IPTU
 * Endpoint: POST consultas/pref/mg/belo-horizonte/cndiptu
 * @module infrastructure/providers/infosimples/dtos/PrefMgBeloHorizonteCndiptuDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PrefMgBeloHorizonteCndiptuItemSchema = z.object({
  identificador: z.string().optional(),
  inscricao: z.string().optional(),
  endereco: z.string().optional(),
  situacao: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  certidao_numero: z.string().optional(),
  data_emissao: z.string().optional(),
  validade: z.string().optional(),
  url_certidao: z.string().optional(),
}).passthrough();

export const PrefMgBeloHorizonteCndiptuResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PrefMgBeloHorizonteCndiptuItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PrefMgBeloHorizonteCndiptuItem = z.infer<typeof PrefMgBeloHorizonteCndiptuItemSchema>;
