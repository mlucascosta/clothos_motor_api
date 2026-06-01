/**
 * @fileoverview DTO — Portal Transparência / CNEP (Cadastro Nacional de Empresas Punidas)
 * Endpoint: POST consultas/portal-transparencia/cnep
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaCnepDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaCnepItemSchema = z
  .object({
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
    valor_multa: z.number().optional(),
    fundamentacao_legal: z.string().optional(),
  })
  .passthrough();

export const PortalTransparenciaCnepResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaCnepItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaCnepItem = z.infer<typeof PortalTransparenciaCnepItemSchema>;
