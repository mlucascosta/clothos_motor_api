/**
 * @fileoverview DTO — Portal Transparência / BPC (Benefício de Prestação Continuada)
 * Endpoint: POST consultas/portal-transparencia/bpc
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaBpcDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaBpcItemSchema = z
  .object({
    cpf: z.string().optional(),
    nis: z.string().optional(),
    nome: z.string().optional(),
    valor: z.number().optional(),
    data_inicio: z.string().optional(),
    data_fim: z.string().optional(),
    competencia: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    tipo_beneficio: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

export const PortalTransparenciaBpcResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaBpcItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaBpcItem = z.infer<typeof PortalTransparenciaBpcItemSchema>;
