/**
 * @fileoverview DTO de CAFCadastroNacionalAgriculturaPF — DirectData.
 * @module infrastructure/providers/directdata/dtos/CAFCadastroNacionalAgriculturaPFDto
 */

import { z } from 'zod';

export const CAFCadastroNacionalAgriculturaPFRetornoSchema = z.object({
  atividadePrincipal: z.string().nullable().optional(),
  cadastrador: z.string().nullable().optional(),
  caracterizacaoUFPA: z.string().nullable().optional(),
  cnpjEntidade: z.string().nullable().optional(),
  composicaoFamiliar: z.array(z.record(z.unknown())).nullable().optional(),
  condicaoPosseUso: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataInscricao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  enquadramentoPRONAF: z.string().nullable().optional(),
  entidadeResponsavel: z.string().nullable().optional(),
  formasAssociativas: z.array(z.record(z.unknown())).nullable().optional(),
  municipio: z.string().nullable().optional(),
  numImoveisExplorados: z.number().int().nullable().optional(),
  numeroCaf: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  tamanhoImovelPrincipal: z.string().nullable().optional(),
  totalEstabelecimentoHA: z.number().nullable().optional(),
  totalEstabelecimentoM2: z.number().nullable().optional(),
  uf: z.string().nullable().optional(),
  ultimaAtualizacao: z.string().nullable().optional(),
});

export type CAFCadastroNacionalAgriculturaPFRetornoDto = z.infer<
  typeof CAFCadastroNacionalAgriculturaPFRetornoSchema
>;
