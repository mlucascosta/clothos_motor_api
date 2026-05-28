/**
 * @fileoverview DTO de GarantiaSafra — DirectData.
 * @module infrastructure/providers/directdata/dtos/GarantiaSafraDto
 */

import { z } from 'zod';

export const GarantiaSafraRetornoSchema = z.object({
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional()
});

export type GarantiaSafraRetornoDto = z.infer<typeof GarantiaSafraRetornoSchema>;
