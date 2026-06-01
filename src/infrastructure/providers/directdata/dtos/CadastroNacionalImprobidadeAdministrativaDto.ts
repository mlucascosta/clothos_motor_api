/**
 * @fileoverview DTO de CadastroNacionalImprobidadeAdministrativa — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroNacionalImprobidadeAdministrativaDto
 */

import { z } from 'zod';

export const CadastroNacionalImprobidadeAdministrativaRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  condenacoes: z.array(z.record(z.unknown())).nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  possuiCondenacao: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type CadastroNacionalImprobidadeAdministrativaRetornoDto = z.infer<
  typeof CadastroNacionalImprobidadeAdministrativaRetornoSchema
>;
