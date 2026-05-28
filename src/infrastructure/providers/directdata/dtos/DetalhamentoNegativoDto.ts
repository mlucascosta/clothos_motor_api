/**
 * @fileoverview DTO de DetalhamentoNegativo — DirectData.
 * @module infrastructure/providers/directdata/dtos/DetalhamentoNegativoDto
 */

import { z } from 'zod';

export const DetalhamentoNegativoRetornoSchema = z.object({
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  pessoaFisica: z.record(z.unknown()),
  pessoaJuridica: z.record(z.unknown())
});

export type DetalhamentoNegativoRetornoDto = z.infer<typeof DetalhamentoNegativoRetornoSchema>;
