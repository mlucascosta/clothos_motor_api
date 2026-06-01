/**
 * @fileoverview DTO — SIT / CAEPI
 * Endpoint: POST consultas/sit/caepi
 * @module infrastructure/providers/infosimples/dtos/SitCaepiDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const SitCaepiItemSchema = z
  .object({
    ca: z.string().optional(),
    equipamento: z.string().optional(),
    fabricante: z.string().optional(),
    cnpj_fabricante: z.string().optional(),
    tipo: z.string().optional(),
    situacao: z.string().optional(),
    data_validade: z.string().optional(),
    data_aprovacao: z.string().optional(),
    normas: z.array(z.string()).optional(),
  })
  .passthrough();

export const SitCaepiResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(SitCaepiItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type SitCaepiItem = z.infer<typeof SitCaepiItemSchema>;
