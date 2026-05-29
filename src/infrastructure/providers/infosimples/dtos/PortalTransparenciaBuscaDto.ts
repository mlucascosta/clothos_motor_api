/**
 * @fileoverview DTO — Portal Transparência / Busca
 * Endpoint: POST consultas/portal-transparencia/busca
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaBuscaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaBuscaItemSchema = z.object({
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  url: z.string().optional(),
  tipo: z.string().optional(),
  data: z.string().optional(),
  orgao: z.string().optional(),
  categoria: z.string().optional(),
}).passthrough();

export const PortalTransparenciaBuscaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaBuscaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaBuscaItem = z.infer<typeof PortalTransparenciaBuscaItemSchema>;
export type PortalTransparenciaBuscaResponse = z.infer<typeof PortalTransparenciaBuscaResponseSchema>;
