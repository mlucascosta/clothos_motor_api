/**
 * @fileoverview DTO de CADINSecretariaFazendaEstaduais — DirectData.
 * @module infrastructure/providers/directdata/dtos/CADINSecretariaFazendaEstaduaisDto
 */

import { z } from 'zod';

export const CADINSecretariaFazendaEstaduaisRetornoSchema = z.object({
  codigoDeclaracao: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  pendencias: z.array(z.record(z.unknown())).nullable().optional(),
  possuiPendencias: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  totalPendencias: z.number().int().nullable().optional(),
  uf: z.string().nullable().optional(),
  valorTotal: z.string().nullable().optional()
});

export type CADINSecretariaFazendaEstaduaisRetornoDto = z.infer<typeof CADINSecretariaFazendaEstaduaisRetornoSchema>;
