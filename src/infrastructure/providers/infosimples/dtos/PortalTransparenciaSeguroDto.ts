/**
 * @fileoverview DTO — Portal Transparência / Seguro Defeso
 * Endpoint: POST consultas/portal-transparencia/seguro
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaSeguroDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaSeguroItemSchema = z
  .object({
    cpf: z.string().optional(),
    nis: z.string().optional(),
    nome: z.string().optional(),
    valor: z.number().optional(),
    data: z.string().optional(),
    competencia: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    situacao: z.string().optional(),
    parcela: z.string().optional(),
  })
  .passthrough();

export const PortalTransparenciaSeguroResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaSeguroItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaSeguroItem = z.infer<typeof PortalTransparenciaSeguroItemSchema>;
export type PortalTransparenciaSeguroResponse = z.infer<
  typeof PortalTransparenciaSeguroResponseSchema
>;
