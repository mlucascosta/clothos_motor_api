/**
 * @fileoverview DTO de DAPPessoaFisica — DirectData.
 * @module infrastructure/providers/directdata/dtos/DAPPessoaFisicaDto
 */

import { z } from 'zod';

export const DAPPessoaFisicaRetornoSchema = z.object({
  caf: z.string().nullable().optional(),
  caracterizacaoBeneficiario: z.array(z.record(z.unknown())).nullable().optional(),
  categorias: z.array(z.record(z.unknown())).nullable().optional(),
  dataDesativacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  emissor: z.record(z.unknown()),
  enquadramento: z.string().nullable().optional(),
  imovel: z.record(z.unknown()),
  motivoDesativacao: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  numeroDAP: z.string().nullable().optional(),
  renda: z.record(z.unknown()),
  tipoDAP: z.string().nullable().optional(),
  titulares: z.array(z.record(z.unknown())).nullable().optional(),
  uf: z.string().nullable().optional(),
  usoTerra: z.array(z.record(z.unknown())).nullable().optional(),
  versao: z.string().nullable().optional(),
});

export type DAPPessoaFisicaRetornoDto = z.infer<typeof DAPPessoaFisicaRetornoSchema>;
