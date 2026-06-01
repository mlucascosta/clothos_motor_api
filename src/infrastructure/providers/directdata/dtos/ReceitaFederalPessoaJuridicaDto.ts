/**
 * @fileoverview DTO de ReceitaFederalPessoaJuridica — DirectData.
 * @module infrastructure/providers/directdata/dtos/ReceitaFederalPessoaJuridicaDto
 */

import { z } from 'zod';

export const ReceitaFederalPessoaJuridicaRetornoSchema = z.object({
  atividadeEconomicaPrincipal: z.string().nullable().optional(),
  atividadesEconomicasSecundarias: z.array(z.record(z.unknown())).nullable().optional(),
  bairroDistrito: z.string().nullable().optional(),
  capitalSocialQSA: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  dataAbertura: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataSituacaoCadastral: z.string().nullable().optional(),
  dataSituacaoEspecial: z.string().nullable().optional(),
  efr: z.string().nullable().optional(),
  emRecuperJudicial: z.boolean().nullable().optional(),
  enderecoEletronico: z.string().nullable().optional(),
  logradouro: z.string().nullable().optional(),
  matriz: z.boolean().nullable().optional(),
  motivoSituacaoCadastral: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  naturezaJuridica: z.string().nullable().optional(),
  nomeEmpresarial: z.string().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  numero: z.string().nullable().optional(),
  numeroInscricao: z.string().nullable().optional(),
  porte: z.string().nullable().optional(),
  situacaoCadastral: z.string().nullable().optional(),
  situacaoEspecial: z.string().nullable().optional(),
  socios: z.array(z.record(z.unknown())).nullable().optional(),
  telefone: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

export type ReceitaFederalPessoaJuridicaRetornoDto = z.infer<
  typeof ReceitaFederalPessoaJuridicaRetornoSchema
>;
