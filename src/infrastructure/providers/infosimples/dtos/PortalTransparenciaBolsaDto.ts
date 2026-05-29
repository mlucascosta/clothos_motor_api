/**
 * @fileoverview DTO — Portal Transparência / Bolsa Família
 * Endpoint: POST consultas/portal-transparencia/bolsa
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaBolsaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaBolsaItemSchema = z.object({
  cpf: z.string().optional(),
  nis: z.string().optional(),
  nome: z.string().optional(),
  valor: z.number().optional(),
  data: z.string().optional(),
  competencia: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  situacao: z.string().optional(),
  quantidade_membros: z.number().optional(),
}).passthrough();

export const PortalTransparenciaBolsaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaBolsaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaBolsaItem = z.infer<typeof PortalTransparenciaBolsaItemSchema>;
export type PortalTransparenciaBolsaResponse = z.infer<typeof PortalTransparenciaBolsaResponseSchema>;
