/**
 * @fileoverview DTO de CadastroPessoaFisicaPlus — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroPessoaFisicaPlusDto
 */

import { z } from 'zod';

export const CadastroPessoaFisicaPlusRetornoSchema = z.object({
  cbo: z.string().nullable().optional(),
  classeSocial: z.string().nullable().optional(),
  codigoCBO: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  dataSituacaoCadastral: z.string().nullable().optional(),
  emails: z.array(z.record(z.unknown())).nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  idade: z.number().int().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  nomePai: z.string().nullable().optional(),
  obito: z.boolean().nullable().optional(),
  parentescos: z.array(z.record(z.unknown())).nullable().optional(),
  rendaEstimada: z.string().nullable().optional(),
  rendaFaixaSalarial: z.string().nullable().optional(),
  sexo: z.string().nullable().optional(),
  signo: z.string().nullable().optional(),
  situacaoCadastral: z.string().nullable().optional(),
  telefones: z.array(z.record(z.unknown())).nullable().optional()
});

export type CadastroPessoaFisicaPlusRetornoDto = z.infer<typeof CadastroPessoaFisicaPlusRetornoSchema>;
