/**
 * @fileoverview DTO de PEPParentescos — DirectData.
 * @module infrastructure/providers/directdata/dtos/PEPParentescosDto
 */

import { z } from 'zod';

export const PEPParentescosRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  funcao: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  orgao: z.string().nullable().optional(),
  parentescos: z.array(z.record(z.unknown())).nullable().optional(),
  pep: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type PEPParentescosRetornoDto = z.infer<typeof PEPParentescosRetornoSchema>;
