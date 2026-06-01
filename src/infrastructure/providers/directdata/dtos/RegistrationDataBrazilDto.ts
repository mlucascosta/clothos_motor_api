/**
 * @fileoverview DTO de RegistrationDataBrazil — DirectData.
 * @module infrastructure/providers/directdata/dtos/RegistrationDataBrazilDto
 */

import { z } from 'zod';

export const RegistrationDataBrazilRetornoSchema = z.object({
  addresses: z.array(z.record(z.unknown())).nullable().optional(),
  age: z.number().int().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  emails: z.array(z.record(z.unknown())).nullable().optional(),
  estimatedSalary: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  nameMother: z.string().nullable().optional(),
  phones: z.array(z.record(z.unknown())).nullable().optional(),
  salaryRange: z.string().nullable().optional(),
});

export type RegistrationDataBrazilRetornoDto = z.infer<typeof RegistrationDataBrazilRetornoSchema>;
