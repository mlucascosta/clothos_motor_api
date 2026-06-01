/**
 * @fileoverview DTO — CAR / Imóvel
 * Endpoint: POST consultas/car/imovel
 * @module infrastructure/providers/infosimples/dtos/CarImovelDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CarImovelItemSchema = z
  .object({
    car: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    status: z.string().optional(),
    tipo_imovel: z.string().optional(),
    area_total: z.number().optional(),
    proprietario: z.string().optional(),
    cpf_cnpj: z.string().optional(),
    data_inscricao: z.string().optional(),
    data_retificacao: z.string().optional(),
  })
  .passthrough();

export const CarImovelResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CarImovelItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CarImovelItem = z.infer<typeof CarImovelItemSchema>;
