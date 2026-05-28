/**
 * @fileoverview DTO de Interpol — DirectData.
 * @module infrastructure/providers/directdata/dtos/InterpolDto
 */

import { z } from 'zod';

export const InterpolRetornoSchema = z.object({
  interpol: z.record(z.unknown()),
  observacao: z.string().nullable().optional()
});

export type InterpolRetornoDto = z.infer<typeof InterpolRetornoSchema>;
