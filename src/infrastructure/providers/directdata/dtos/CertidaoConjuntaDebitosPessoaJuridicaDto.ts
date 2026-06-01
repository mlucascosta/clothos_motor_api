/**
 * @fileoverview DTO de CertidaoConjuntaDebitosPessoaJuridica — DirectData.
 * @module infrastructure/providers/directdata/dtos/CertidaoConjuntaDebitosPessoaJuridicaDto
 */

import { z } from 'zod';

export const CertidaoConjuntaDebitosPessoaJuridicaRetornoSchema = z.object({
  cnpj: z.string().nullable().optional(),
  codigoControleCertidao: z.string().nullable().optional(),
  emitidaAs: z.string().nullable().optional(),
  listaDividas: z.array(z.record(z.unknown())).nullable().optional(),
  nome: z.string().nullable().optional(),
  portaria: z.string().nullable().optional(),
  possuiDividas: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  titulo: z.string().nullable().optional(),
  validaAte: z.string().nullable().optional(),
});

export type CertidaoConjuntaDebitosPessoaJuridicaRetornoDto = z.infer<
  typeof CertidaoConjuntaDebitosPessoaJuridicaRetornoSchema
>;
