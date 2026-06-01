/**
 * @fileoverview DTO — Portal Transparência / Auxílio
 * Endpoint: POST consultas/portal-transparencia/auxilio
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaAuxilioDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaAuxilioItemSchema = z
  .object({
    cpf: z.string().optional(),
    nis: z.string().optional(),
    nome: z.string().optional(),
    valor: z.number().optional(),
    data: z.string().optional(),
    competencia: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    beneficio: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const PortalTransparenciaAuxilioResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaAuxilioItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaAuxilioItem = z.infer<typeof PortalTransparenciaAuxilioItemSchema>;
export type PortalTransparenciaAuxilioResponse = z.infer<
  typeof PortalTransparenciaAuxilioResponseSchema
>;
