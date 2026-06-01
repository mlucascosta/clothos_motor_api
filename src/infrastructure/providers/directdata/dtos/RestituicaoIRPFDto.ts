/**
 * @fileoverview DTO de RestituicaoIRPF — DirectData.
 * @module infrastructure/providers/directdata/dtos/RestituicaoIRPFDto
 */

import { z } from 'zod';

export const RestituicaoIRPFRetornoSchema = z.object({
  debitoAutomatico: z.string().nullable().optional(),
  exercicio: z.number().int().nullable().optional(),
  fila: z.boolean().nullable().optional(),
  nomeContribuinte: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  restituicao: z.record(z.unknown()),
  resultado: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  tipoDeclaracao: z.string().nullable().optional(),
});

export type RestituicaoIRPFRetornoDto = z.infer<typeof RestituicaoIRPFRetornoSchema>;
