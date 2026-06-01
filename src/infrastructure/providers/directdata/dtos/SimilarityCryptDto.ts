/**
 * @fileoverview DTO de Similarity/Crypt — DirectData.
 * @module infrastructure/providers/directdata/dtos/SimilarityCryptDto
 */

import { z } from 'zod';

export const SimilarityCryptRetornoSchema = z.object({
  address: z.record(z.unknown()),
  city: z.record(z.unknown()),
  cpf: z.record(z.unknown()),
  dob: z.record(z.unknown()),
  name: z.record(z.unknown()),
  phone: z.array(z.record(z.unknown())).nullable().optional(),
  postCode: z.record(z.unknown()),
  state: z.record(z.unknown()),
});

export type SimilarityCryptRetornoDto = z.infer<typeof SimilarityCryptRetornoSchema>;
