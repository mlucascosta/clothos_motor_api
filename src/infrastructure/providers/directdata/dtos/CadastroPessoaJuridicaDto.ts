/**
 * @fileoverview DTO de CadastroPessoaJuridica — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroPessoaJuridicaDto
 */

import { z } from 'zod';

export const CadastroPessoaJuridicaRetornoSchema = z.object({
  cnaEsSecundarios: z.array(z.record(z.unknown())).nullable().optional(),
  cnaeCodigo: z.number().int().nullable().optional(),
  cnaeDescricao: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  dataFundacao: z.string().nullable().optional(),
  emails: z.array(z.record(z.unknown())).nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  faixaFaturamento: z.string().nullable().optional(),
  faixaFuncionarios: z.string().nullable().optional(),
  matriz: z.boolean().nullable().optional(),
  naturezaJuridicaCodigo: z.number().int().nullable().optional(),
  naturezaJuridicaDescricao: z.string().nullable().optional(),
  naturezaJuridicaTipo: z.string().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  orgaoPublico: z.string().nullable().optional(),
  porte: z.string().nullable().optional(),
  quantidadeFuncionarios: z.number().int().nullable().optional(),
  ramo: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  situacaoCadastral: z.string().nullable().optional(),
  socios: z.array(z.record(z.unknown())).nullable().optional(),
  telefones: z.array(z.record(z.unknown())).nullable().optional(),
  tipoEmpresa: z.string().nullable().optional(),
  ultimaAtualizacaoPJ: z.string().nullable().optional(),
});

export type CadastroPessoaJuridicaRetornoDto = z.infer<typeof CadastroPessoaJuridicaRetornoSchema>;
