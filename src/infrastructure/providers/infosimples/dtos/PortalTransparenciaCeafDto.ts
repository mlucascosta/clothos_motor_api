/**
 * @fileoverview DTO — Portal Transparência / CEAF (Componente Especializado da Assistência Farmacêutica)
 * Endpoint: POST consultas/portal-transparencia/ceaf
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaCeafDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaCeafItemSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  medicamento: z.string().optional(),
  cid: z.string().optional(),
  quantidade: z.number().optional(),
  valor: z.number().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

export const PortalTransparenciaCeafResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaCeafItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaCeafItem = z.infer<typeof PortalTransparenciaCeafItemSchema>;
