/**
 * @fileoverview DTO de SituacaoEleitoral — DirectData.
 * @module infrastructure/providers/directdata/dtos/SituacaoEleitoralDto
 */

import { z } from 'zod';

export const SituacaoEleitoralRetornoSchema = z.object({
  biometriaColetada: z.boolean().nullable().optional(),
  identificacao: z.string().nullable().optional(),
  isRegular: z.boolean().nullable().optional(),
  status: z.string().nullable().optional()
});

export type SituacaoEleitoralRetornoDto = z.infer<typeof SituacaoEleitoralRetornoSchema>;
