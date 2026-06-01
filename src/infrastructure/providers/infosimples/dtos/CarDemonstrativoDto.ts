/**
 * @fileoverview DTO — CAR / Demonstrativo
 * Endpoint: POST consultas/car/demonstrativo
 * @module infrastructure/providers/infosimples/dtos/CarDemonstrativoDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CarDemonstrativoItemSchema = z
  .object({
    car: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    status: z.string().optional(),
    tipo_imovel: z.string().optional(),
    area_total: z.number().optional(),
    area_consolidada: z.number().optional(),
    area_remanescente: z.number().optional(),
    proprietario: z.string().optional(),
    cpf_cnpj: z.string().optional(),
  })
  .passthrough();

export const CarDemonstrativoResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CarDemonstrativoItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CarDemonstrativoItem = z.infer<typeof CarDemonstrativoItemSchema>;
