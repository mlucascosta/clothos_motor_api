/**
 * @fileoverview DTO — Portal Transparência / CEIS (Cadastro de Empresas Inidôneas e Suspensas)
 * Endpoint: POST consultas/portal-transparencia/ceis
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaCeisDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaCeisItemSchema = z.object({
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  razao_social: z.string().optional(),
  tipo_sancao: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  orgao_sancionador: z.string().optional(),
  uf_orgao: z.string().optional(),
  numero_processo: z.string().optional(),
  fundamentacao_legal: z.string().optional(),
  descricao_sancao: z.string().optional(),
}).passthrough();

export const PortalTransparenciaCeisResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaCeisItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaCeisItem = z.infer<typeof PortalTransparenciaCeisItemSchema>;
