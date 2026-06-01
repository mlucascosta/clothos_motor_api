/**
 * @fileoverview DTO — Portal Transparência / Acordos de Leniência
 * Endpoint: POST consultas/portal-transparencia/leniencia
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaLenienciaDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaLenienciaItemSchema = z
  .object({
    cnpj: z.string().optional(),
    razao_social: z.string().optional(),
    numero_acordo: z.string().optional(),
    data_assinatura: z.string().optional(),
    data_fim: z.string().optional(),
    orgao: z.string().optional(),
    situacao: z.string().optional(),
    descricao: z.string().optional(),
  })
  .passthrough();

export const PortalTransparenciaLenienciaResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaLenienciaItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaLenienciaItem = z.infer<
  typeof PortalTransparenciaLenienciaItemSchema
>;
