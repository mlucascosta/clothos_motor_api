/**
 * @fileoverview DTO — CAR / Demonstrativo PDF
 * Endpoint: POST consultas/car/demonstrativo-pdf
 * @module infrastructure/providers/infosimples/dtos/CarDemonstrativoPdfDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CarDemonstrativoPdfItemSchema = z
  .object({
    car: z.string().optional(),
    url_pdf: z.string().optional(),
    url_expiracao: z.string().optional(),
  })
  .passthrough();

export const CarDemonstrativoPdfResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CarDemonstrativoPdfItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CarDemonstrativoPdfItem = z.infer<typeof CarDemonstrativoPdfItemSchema>;
