/**
 * @fileoverview DTO — Portal Transparência / Repasse
 * Endpoint: POST consultas/portal-transparencia/repasse
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaRepasseDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaRepasseItemSchema = z
  .object({
    ano: z.string().optional(),
    localidade: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    codigo_ibge: z.string().optional(),
    funcao: z.string().optional(),
    subfuncao: z.string().optional(),
    valor: z.number().optional(),
    valor_empenhado: z.number().optional(),
    valor_liquidado: z.number().optional(),
    valor_pago: z.number().optional(),
  })
  .passthrough();

export const PortalTransparenciaRepasseResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaRepasseItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaRepasseItem = z.infer<typeof PortalTransparenciaRepasseItemSchema>;
