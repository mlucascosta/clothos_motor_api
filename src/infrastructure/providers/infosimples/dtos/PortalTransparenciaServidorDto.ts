/**
 * @fileoverview DTO — Portal Transparência / Servidor Federal
 * Endpoint: POST consultas/portal-transparencia/servidor
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaServidorDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaServidorItemSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  matricula: z.string().optional(),
  cargo: z.string().optional(),
  orgao: z.string().optional(),
  situacao: z.string().optional(),
  remuneracao_bruta: z.number().optional(),
  remuneracao_liquida: z.number().optional(),
  data_ingresso: z.string().optional(),
  uf: z.string().optional(),
  municipio: z.string().optional(),
}).passthrough();

export const PortalTransparenciaServidorResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaServidorItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaServidorItem = z.infer<typeof PortalTransparenciaServidorItemSchema>;
