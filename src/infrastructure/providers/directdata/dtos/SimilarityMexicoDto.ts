/**
 * @fileoverview DTO de SimilarityMexico — DirectData.
 * @module infrastructure/providers/directdata/dtos/SimilarityMexicoDto
 */

import { z } from 'zod';

export const SimilarityMexicoRetornoSchema = z.object({
  address: z.record(z.unknown()),
  city: z.record(z.unknown()),
  curp: z.record(z.unknown()),
  dob: z.record(z.unknown()),
  name: z.record(z.unknown()),
  phone: z.array(z.record(z.unknown())).nullable().optional(),
  postCode: z.record(z.unknown()),
  state: z.record(z.unknown()),
});

export type SimilarityMexicoRetornoDto = z.infer<typeof SimilarityMexicoRetornoSchema>;
