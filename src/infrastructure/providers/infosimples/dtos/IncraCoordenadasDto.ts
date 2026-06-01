/**
 * @fileoverview DTO — INCRA / Coordenadas
 * Endpoint: POST consultas/incra/coordenadas
 * @module infrastructure/providers/infosimples/dtos/IncraCoordenadasDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const IncraCoordenadasItemSchema = z
  .object({
    numero_certificacao: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    area: z.number().optional(),
    coordenadas: z.array(z.unknown()).optional(),
    status: z.string().optional(),
  })
  .passthrough();

export const IncraCoordenadasResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(IncraCoordenadasItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type IncraCoordenadasItem = z.infer<typeof IncraCoordenadasItemSchema>;
