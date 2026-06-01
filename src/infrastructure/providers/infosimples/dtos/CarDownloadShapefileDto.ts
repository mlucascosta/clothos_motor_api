/**
 * @fileoverview DTO — CAR / Download Shapefile
 * Endpoint: POST consultas/car/download-shapefile
 * @module infrastructure/providers/infosimples/dtos/CarDownloadShapefileDto
 */
import { z } from 'zod';
import { InfosimplesResponseHeaderSchema } from './InfosimplesResponseDto.js';

export const CarDownloadShapefileItemSchema = z
  .object({
    car: z.string().optional(),
    url_shapefile: z.string().optional(),
    url_expiracao: z.string().optional(),
  })
  .passthrough();

export const CarDownloadShapefileResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: InfosimplesResponseHeaderSchema,
  data: z.array(CarDownloadShapefileItemSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
  site_receipts: z.array(z.string()).optional(),
});

export type CarDownloadShapefileItem = z.infer<typeof CarDownloadShapefileItemSchema>;
