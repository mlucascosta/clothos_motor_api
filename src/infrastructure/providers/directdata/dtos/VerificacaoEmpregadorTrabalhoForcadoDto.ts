/**
 * @fileoverview DTO de VerificacaoEmpregadorTrabalhoForcado — DirectData.
 * @module infrastructure/providers/directdata/dtos/VerificacaoEmpregadorTrabalhoForcadoDto
 */

import { z } from 'zod';

export const VerificacaoEmpregadorTrabalhoForcadoRetornoSchema = z.object({
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  empregador: z.string().nullable().optional(),
  locais: z.array(z.record(z.unknown())).nullable().optional(),
  possuiTrabalhoForcado: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  totalTrabalhadores: z.number().int().nullable().optional()
});

export type VerificacaoEmpregadorTrabalhoForcadoRetornoDto = z.infer<typeof VerificacaoEmpregadorTrabalhoForcadoRetornoSchema>;
