/**
 * @fileoverview DTO — ONR / Mapa Registro de Imóveis
 * Endpoint: POST consultas/onr/mapa-registro-imoveis
 * @module infrastructure/providers/infosimples/dtos/OnrMapaRegistroImoveisDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const OnrMapaRegistroImoveisItemSchema = z
  .object({
    camada: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    cartorio: z.string().optional(),
    cns: z.string().optional(),
    endereco: z.string().optional(),
    responsavel: z.string().optional(),
  })
  .passthrough();

export const OnrMapaRegistroImoveisResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(OnrMapaRegistroImoveisItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type OnrMapaRegistroImoveisItem = z.infer<typeof OnrMapaRegistroImoveisItemSchema>;
