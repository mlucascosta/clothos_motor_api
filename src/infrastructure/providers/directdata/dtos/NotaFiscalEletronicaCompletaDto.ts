/**
 * @fileoverview DTO de NotaFiscalEletronicaCompleta — DirectData.
 * @module infrastructure/providers/directdata/dtos/NotaFiscalEletronicaCompletaDto
 */

import { z } from 'zod';

export const NotaFiscalEletronicaCompletaRetornoSchema = z.object({
  chaveNFe: z.string().nullable().optional(),
  destinatario: z.record(z.unknown()),
  emitente: z.record(z.unknown()),
  formasPagamento: z.array(z.record(z.unknown())).nullable().optional(),
  identificacao: z.record(z.unknown()),
  informacoesComplementares: z.string().nullable().optional(),
  itens: z.array(z.record(z.unknown())).nullable().optional(),
  totais: z.record(z.unknown()),
  transporte: z.record(z.unknown())
});

export type NotaFiscalEletronicaCompletaRetornoDto = z.infer<typeof NotaFiscalEletronicaCompletaRetornoSchema>;
