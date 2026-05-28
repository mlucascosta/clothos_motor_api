/**
 * @fileoverview DTO de CertidaoConjuntaDebitosPessoaFisica — DirectData.
 * @module infrastructure/providers/directdata/dtos/CertidaoConjuntaDebitosPessoaFisicaDto
 */

import { z } from 'zod';

export const CertidaoConjuntaDebitosPessoaFisicaRetornoSchema = z.object({
  codigoControleCertidao: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  emitidaAs: z.string().nullable().optional(),
  listaDividas: z.array(z.record(z.unknown())).nullable().optional(),
  nome: z.string().nullable().optional(),
  portaria: z.string().nullable().optional(),
  possuiDividas: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  titulo: z.string().nullable().optional(),
  validaAte: z.string().nullable().optional()
});

export type CertidaoConjuntaDebitosPessoaFisicaRetornoDto = z.infer<typeof CertidaoConjuntaDebitosPessoaFisicaRetornoSchema>;
