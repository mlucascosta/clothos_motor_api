/**
 * @fileoverview DTO de PETITrabalhoInfantil — DirectData.
 * @module infrastructure/providers/directdata/dtos/PETITrabalhoInfantilDto
 */

import { z } from 'zod';

export const PETITrabalhoInfantilRetornoSchema = z.object({
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
});

export type PETITrabalhoInfantilRetornoDto = z.infer<typeof PETITrabalhoInfantilRetornoSchema>;
