/**
 * @fileoverview DTO de SimilarityArgentina — DirectData.
 * @module infrastructure/providers/directdata/dtos/SimilarityArgentinaDto
 */

import { z } from 'zod';

export const SimilarityArgentinaRetornoSchema = z.object({
  address: z.record(z.unknown()),
  city: z.record(z.unknown()),
  dni: z.record(z.unknown()),
  dob: z.record(z.unknown()),
  name: z.record(z.unknown()),
  phone: z.array(z.record(z.unknown())).nullable().optional(),
  postCode: z.record(z.unknown()),
  state: z.record(z.unknown()),
});

export type SimilarityArgentinaRetornoDto = z.infer<typeof SimilarityArgentinaRetornoSchema>;
