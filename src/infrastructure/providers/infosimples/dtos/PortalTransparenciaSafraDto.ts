/**
 * @fileoverview DTO — Portal Transparência / Garantia Safra
 * Endpoint: POST consultas/portal-transparencia/safra
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaSafraDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaSafraItemSchema = z
  .object({
    cpf: z.string().optional(),
    nis: z.string().optional(),
    nome: z.string().optional(),
    valor: z.number().optional(),
    data: z.string().optional(),
    competencia: z.string().optional(),
    ano_safra: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const PortalTransparenciaSafraResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaSafraItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaSafraItem = z.infer<typeof PortalTransparenciaSafraItemSchema>;
export type PortalTransparenciaSafraResponse = z.infer<
  typeof PortalTransparenciaSafraResponseSchema
>;
