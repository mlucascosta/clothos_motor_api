/**
 * @fileoverview DTO — CVM / Processo Administrativo
 * Endpoint: POST consultas/cvm/processo-administrativo
 * @module infrastructure/providers/infosimples/dtos/CvmProcessoAdministrativoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CvmProcessoAdministrativoItemSchema = z.object({
  numero_processo: z.string().optional(),
  assunto: z.string().optional(),
  situacao: z.string().optional(),
  data_instauracao: z.string().optional(),
  acusados: z.array(z.object({
    nome: z.string().optional(),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    penalidade: z.string().optional(),
  }).passthrough()).optional(),
  relator: z.string().optional(),
  decisao: z.string().optional(),
}).passthrough();

export const CvmProcessoAdministrativoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CvmProcessoAdministrativoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CvmProcessoAdministrativoItem = z.infer<typeof CvmProcessoAdministrativoItemSchema>;
