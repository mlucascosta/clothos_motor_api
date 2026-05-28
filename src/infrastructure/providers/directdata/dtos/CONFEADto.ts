/**
 * @fileoverview DTO de CONFEA — DirectData.
 * @module infrastructure/providers/directdata/dtos/CONFEADto
 */

import { z } from 'zod';

export const CONFEARetornoSchema = z.object({
  atribuicoesGraduacao: z.string().nullable().optional(),
  atribuicoesPosGraduacao: z.string().nullable().optional(),
  crea: z.string().nullable().optional(),
  cursosPosGraduacao: z.array(z.record(z.unknown())).nullable().optional(),
  dataRegistro: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  registroNacional: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  titulosGraduacao: z.array(z.record(z.unknown())).nullable().optional(),
  vistos: z.array(z.record(z.unknown())).nullable().optional()
});

export type CONFEARetornoDto = z.infer<typeof CONFEARetornoSchema>;
