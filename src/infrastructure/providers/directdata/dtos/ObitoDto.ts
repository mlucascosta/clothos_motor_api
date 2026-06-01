/**
 * @fileoverview DTO de Obito — DirectData.
 * @module infrastructure/providers/directdata/dtos/ObitoDto
 */

import { z } from 'zod';

export const ObitoRetornoSchema = z.object({
  anoObito: z.number().int().nullable().optional(),
  constaObito: z.boolean().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataObito: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type ObitoRetornoDto = z.infer<typeof ObitoRetornoSchema>;
