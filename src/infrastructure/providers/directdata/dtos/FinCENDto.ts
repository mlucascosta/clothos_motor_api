/**
 * @fileoverview DTO de FinCEN — DirectData.
 * @module infrastructure/providers/directdata/dtos/FinCENDto
 */

import { z } from 'zod';

export const FinCENRetornoSchema = z.object({
  empresas: z.array(z.record(z.unknown())).nullable().optional(),
  nomeConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  resultadosEncontrados: z.number().int().optional(),
});

export type FinCENRetornoDto = z.infer<typeof FinCENRetornoSchema>;
