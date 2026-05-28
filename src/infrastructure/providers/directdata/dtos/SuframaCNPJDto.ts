/**
 * @fileoverview DTO de SuframaCNPJ — DirectData.
 * @module infrastructure/providers/directdata/dtos/SuframaCNPJDto
 */

import { z } from 'zod';

export const SuframaCNPJRetornoSchema = z.object({
  inscricoes: z.array(z.record(z.unknown())).nullable().optional(),
  quantidadeInscricoes: z.number().int().nullable().optional()
});

export type SuframaCNPJRetornoDto = z.infer<typeof SuframaCNPJRetornoSchema>;
