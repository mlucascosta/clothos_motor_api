/**
 * @fileoverview DTO — Portal Transparência / Convênios
 * Endpoint: POST consultas/portal-transparencia/convenios
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaConveniosDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaConveniosItemSchema = z.object({
  numero_convenio: z.string().optional(),
  convenente: z.string().optional(),
  cnpj_convenente: z.string().optional(),
  concedente: z.string().optional(),
  objeto: z.string().optional(),
  valor_global: z.number().optional(),
  valor_repasse: z.number().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  situacao: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
}).passthrough();

export const PortalTransparenciaConveniosResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaConveniosItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaConveniosItem = z.infer<typeof PortalTransparenciaConveniosItemSchema>;
