/**
 * @fileoverview DTO de SeguroDefeso — DirectData.
 * @module infrastructure/providers/directdata/dtos/SeguroDefesoDto
 */

import { z } from 'zod';

export const SeguroDefesoRetornoSchema = z.object({
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  rgp: z.string().nullable().optional(),
});

export type SeguroDefesoRetornoDto = z.infer<typeof SeguroDefesoRetornoSchema>;
