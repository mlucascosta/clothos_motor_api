/**
 * @fileoverview DTO de TituloLocalVotacao — DirectData.
 * @module infrastructure/providers/directdata/dtos/TituloLocalVotacaoDto
 */

import { z } from 'zod';

export const TituloLocalVotacaoRetornoSchema = z.object({
  biometriaColetada: z.boolean().nullable().optional(),
  domicilioEleitoral: z.record(z.unknown()),
  identificacao: z.record(z.unknown()),
  status: z.string().nullable().optional()
});

export type TituloLocalVotacaoRetornoDto = z.infer<typeof TituloLocalVotacaoRetornoSchema>;
