/**
 * @fileoverview DTO — SIT / Trabalho Escravo
 * Endpoint: POST consultas/sit/trabalho-escravo
 * @module infrastructure/providers/infosimples/dtos/SitTrabalhoEscravoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const SitTrabalhoEscravoItemSchema = z
  .object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    nome: z.string().optional(),
    razao_social: z.string().optional(),
    ano: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    trabalhadores_resgatados: z.number().optional(),
    data_inclusao: z.string().optional(),
  })
  .passthrough();

export const SitTrabalhoEscravoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(SitTrabalhoEscravoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type SitTrabalhoEscravoItem = z.infer<typeof SitTrabalhoEscravoItemSchema>;
