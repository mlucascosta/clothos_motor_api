/**
 * @fileoverview DTO de BolsaFamilia — DirectData.
 * @module infrastructure/providers/directdata/dtos/BolsaFamiliaDto
 */

import { z } from 'zod';

export const BolsaFamiliaRetornoSchema = z.object({
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional()
});

export type BolsaFamiliaRetornoDto = z.infer<typeof BolsaFamiliaRetornoSchema>;
