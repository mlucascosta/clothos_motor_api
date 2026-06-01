/**
 * @fileoverview DTO de DAPPessoaJuridica — DirectData.
 * @module infrastructure/providers/directdata/dtos/DAPPessoaJuridicaDto
 */

import { z } from 'zod';

export const DAPPessoaJuridicaRetornoSchema = z.object({
  cnpj: z.string().nullable().optional(),
  composicaoSocietaria: z.array(z.record(z.unknown())).nullable().optional(),
  cpfRepresentanteLegal: z.string().nullable().optional(),
  daPsPorMunicipios: z.array(z.record(z.unknown())).nullable().optional(),
  dataConstituicao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  emissor: z.record(z.unknown()),
  municipio: z.string().nullable().optional(),
  nomeRepresentanteLegal: z.string().nullable().optional(),
  numeroDAP: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  resultadoAssociados: z.array(z.record(z.unknown())).nullable().optional(),
  tipo: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  versao: z.string().nullable().optional(),
});

export type DAPPessoaJuridicaRetornoDto = z.infer<typeof DAPPessoaJuridicaRetornoSchema>;
