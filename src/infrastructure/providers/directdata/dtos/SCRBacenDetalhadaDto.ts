/**
 * @fileoverview DTO de SCRBacenDetalhada — DirectData.
 * @module infrastructure/providers/directdata/dtos/SCRBacenDetalhadaDto
 */

import { z } from 'zod';

export const SCRBacenDetalhadaRetornoSchema = z.object({
  carteiraCredito: z.record(z.unknown()),
  dataInicioRelacionamento: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  faixaRisco: z.string().nullable().optional(),
  modalidades: z.array(z.record(z.unknown())).nullable().optional(),
  numeroHistorico: z.number().int().nullable().optional(),
  obrigacaoAssumida: z.string().nullable().optional(),
  obrigacaoResumida: z.string().nullable().optional(),
  percentualDocumentoProcessado: z.string().nullable().optional(),
  percentualVolumeProcessado: z.string().nullable().optional(),
  quantidadeInstituicoes: z.number().int().nullable().optional(),
  quantidadeOperacoes: z.number().int().nullable().optional(),
  quantidadeOperacoesDiscordancia: z.number().int().nullable().optional(),
  quantidadeOperacoesSubjudice: z.number().int().nullable().optional(),
  responsabilidadeTotal: z.string().nullable().optional(),
  responsabilidadeTotalDiscordancia: z.string().nullable().optional(),
  responsabilidadeTotalSubJudice: z.string().nullable().optional(),
  riscoIndiretoVendor: z.string().nullable().optional(),
  riscoTotal: z.string().nullable().optional(),
  score: z.string().nullable().optional(),
  scoreObservacao: z.string().nullable().optional()
});

export type SCRBacenDetalhadaRetornoDto = z.infer<typeof SCRBacenDetalhadaRetornoSchema>;
