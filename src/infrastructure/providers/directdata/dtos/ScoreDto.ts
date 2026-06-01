/**
 * @fileoverview DTO de Score — DirectData.
 * @module infrastructure/providers/directdata/dtos/ScoreDto
 */

import { z } from 'zod';

export const ScoreRetornoSchema = z.object({
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  pessoaFisica: z.record(z.unknown()),
  pessoaJuridica: z.record(z.unknown()),
});

export type ScoreRetornoDto = z.infer<typeof ScoreRetornoSchema>;
