/**
 * @fileoverview DTO de CaixaRegularidadeEmpregadorFGTS — DirectData.
 * @module infrastructure/providers/directdata/dtos/CaixaRegularidadeEmpregadorFGTSDto
 */

import { z } from 'zod';

export const CaixaRegularidadeEmpregadorFGTSRetornoSchema = z.object({
  dataEmissao: z.string().nullable().optional(),
  endereco: z.record(z.unknown()),
  historico: z.array(z.record(z.unknown())).nullable().optional(),
  inscricao: z.string().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  numeroCertificado: z.string().nullable().optional(),
  periodoValidade: z.record(z.unknown()),
  possuiIrregularidade: z.boolean().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type CaixaRegularidadeEmpregadorFGTSRetornoDto = z.infer<
  typeof CaixaRegularidadeEmpregadorFGTSRetornoSchema
>;
