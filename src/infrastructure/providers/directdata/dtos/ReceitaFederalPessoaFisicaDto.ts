/**
 * @fileoverview DTO de ReceitaFederalPessoaFisica — DirectData.
 * @module infrastructure/providers/directdata/dtos/ReceitaFederalPessoaFisicaDto
 */

import { z } from 'zod';

export const ReceitaFederalPessoaFisicaRetornoSchema = z.object({
  anoObito: z.string().nullable().optional(),
  codigoControleComprovante: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataInscricao: z.string().nullable().optional(),
  dataInscricaoAnterior1990: z.boolean().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  digitoVerificador: z.string().nullable().optional(),
  nomePessoaFisica: z.string().nullable().optional(),
  nomeSocial: z.string().nullable().optional(),
  numeroCPF: z.string().nullable().optional(),
  possuiObito: z.boolean().nullable().optional(),
  situacaoCadastral: z.string().nullable().optional()
});

export type ReceitaFederalPessoaFisicaRetornoDto = z.infer<typeof ReceitaFederalPessoaFisicaRetornoSchema>;
