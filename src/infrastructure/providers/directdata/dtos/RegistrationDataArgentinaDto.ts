/**
 * @fileoverview DTO de RegistrationDataArgentina — DirectData.
 * @module infrastructure/providers/directdata/dtos/RegistrationDataArgentinaDto
 */

import { z } from 'zod';

export const RegistrationDataArgentinaRetornoSchema = z.object({
  addresses: z.array(z.record(z.unknown())).nullable().optional(),
  age: z.number().int().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  dni: z.string().nullable().optional(),
  emails: z.array(z.record(z.unknown())).nullable().optional(),
  estimatedSalary: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  phones: z.array(z.record(z.unknown())).nullable().optional(),
  salaryRange: z.string().nullable().optional(),
});

export type RegistrationDataArgentinaRetornoDto = z.infer<
  typeof RegistrationDataArgentinaRetornoSchema
>;
