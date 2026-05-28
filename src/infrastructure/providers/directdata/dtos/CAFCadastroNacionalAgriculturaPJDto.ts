/**
 * @fileoverview DTO de CAFCadastroNacionalAgriculturaPJ — DirectData.
 * @module infrastructure/providers/directdata/dtos/CAFCadastroNacionalAgriculturaPJDto
 */

import { z } from 'zod';

export const CAFCadastroNacionalAgriculturaPJRetornoSchema = z.object({
  cadastrador: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  cnpjEntidade: z.string().nullable().optional(),
  composicaoSocietaria: z.array(z.record(z.unknown())).nullable().optional(),
  cpfRepresentante: z.string().nullable().optional(),
  dataConstituicao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataInscricao: z.string().nullable().optional(),
  dataUltimoExtrato: z.string().nullable().optional(),
  dataUltimoUploadAssociados: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  emissor: z.record(z.unknown()),
  entidadeResponsavel: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  numeroCaf: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  representanteLegal: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  sociosPorMunicipio: z.array(z.record(z.unknown())).nullable().optional(),
  tipoPessoaJuridica: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  ultimaAtualizacao: z.string().nullable().optional()
});

export type CAFCadastroNacionalAgriculturaPJRetornoDto = z.infer<typeof CAFCadastroNacionalAgriculturaPJRetornoSchema>;
