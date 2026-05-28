/**
 * @fileoverview DTO de RegistrationDataMexico — DirectData.
 * @module infrastructure/providers/directdata/dtos/RegistrationDataMexicoDto
 */

import { z } from 'zod';

export const RegistrationDataMexicoRetornoSchema = z.object({
  addresses: z.array(z.record(z.unknown())).nullable().optional(),
  age: z.number().int().nullable().optional(),
  curp: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  emails: z.array(z.record(z.unknown())).nullable().optional(),
  estimatedSalary: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phones: z.array(z.record(z.unknown())).nullable().optional(),
  rfc: z.string().nullable().optional(),
  salaryRange: z.string().nullable().optional()
});

export type RegistrationDataMexicoRetornoDto = z.infer<typeof RegistrationDataMexicoRetornoSchema>;
