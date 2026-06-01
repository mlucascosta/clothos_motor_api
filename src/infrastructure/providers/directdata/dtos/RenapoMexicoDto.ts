/**
 * @fileoverview DTO de RenapoMexico — DirectData.
 * @module infrastructure/providers/directdata/dtos/RenapoMexicoDto
 */

import { z } from 'zod';

export const RenapoMexicoRetornoSchema = z.object({
  age: z.number().int().nullable().optional(),
  city: z.string().nullable().optional(),
  curp: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  placeOfBirth: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
});

export type RenapoMexicoRetornoDto = z.infer<typeof RenapoMexicoRetornoSchema>;
