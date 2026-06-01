/**
 * @fileoverview DTO — Portal Transparência / PETI (Programa de Erradicação do Trabalho Infantil)
 * Endpoint: POST consultas/portal-transparencia/peti
 * @module infrastructure/providers/infosimples/dtos/PortalTransparenciaPetiDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const PortalTransparenciaPetiItemSchema = z
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
  })
  .passthrough();

export const PortalTransparenciaPetiResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(PortalTransparenciaPetiItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type PortalTransparenciaPetiItem = z.infer<typeof PortalTransparenciaPetiItemSchema>;
export type PortalTransparenciaPetiResponse = z.infer<typeof PortalTransparenciaPetiResponseSchema>;
