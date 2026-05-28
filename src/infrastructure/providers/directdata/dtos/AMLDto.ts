/**
 * @fileoverview DTO de AML — DirectData.
 * @module infrastructure/providers/directdata/dtos/AMLDto
 */

import { z } from 'zod';

export const AMLRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  dataObito: z.string().nullable().optional(),
  genero: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  obito: z.boolean().nullable().optional(),
  parentescos: z.array(z.record(z.unknown())).nullable().optional(),
  pep: z.boolean().nullable().optional(),
  sociedades: z.array(z.record(z.unknown())).nullable().optional()
});

export type AMLRetornoDto = z.infer<typeof AMLRetornoSchema>;
