/**
 * @fileoverview DTO de CorreiosBuscaCEP — DirectData.
 * @module infrastructure/providers/directdata/dtos/CorreiosBuscaCEPDto
 */

import { z } from 'zod';

export const CorreiosBuscaCEPRetornoSchema = z.object({
  enderecoConsultado: z.string().nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  quantidadeEnderecos: z.number().int().optional()
});

export type CorreiosBuscaCEPRetornoDto = z.infer<typeof CorreiosBuscaCEPRetornoSchema>;
