/**
 * @fileoverview DTO de NotaFiscalEletronicaInutilizacao — DirectData.
 * @module infrastructure/providers/directdata/dtos/NotaFiscalEletronicaInutilizacaoDto
 */

import { z } from 'zod';

export const NotaFiscalEletronicaInutilizacaoRetornoSchema = z.object({
  cnpj: z.string().nullable().optional(),
  inutilizacoes: z.array(z.record(z.unknown())).nullable().optional(),
  observacao: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
});

export type NotaFiscalEletronicaInutilizacaoRetornoDto = z.infer<
  typeof NotaFiscalEletronicaInutilizacaoRetornoSchema
>;
