/**
 * @fileoverview DTO — Portal Transparência / CEPIM (Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas)
 * Endpoint: POST consultas/portal-transparencia/cepim
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaCepimDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaCepimItemSchema = z.object({
  cnpj: z.string().optional(),
  razao_social: z.string().optional(),
  motivo_impedimento: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  orgao_concedente: z.string().optional(),
  numero_convenio: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const PortalTransparenciaCepimResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaCepimItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaCepimItem = z.infer<typeof PortalTransparenciaCepimItemSchema>;
