/**
 * @fileoverview DTO de CADINSecretariaFazendaSP — DirectData.
 * @module infrastructure/providers/directdata/dtos/CADINSecretariaFazendaSPDto
 */

import { z } from 'zod';

export const CADINSecretariaFazendaSPRetornoSchema = z.object({
  codigoDeclaracao: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  pendencias: z.array(z.record(z.unknown())).nullable().optional(),
  possuiPendencias: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  totalPendencias: z.number().int().nullable().optional()
});

export type CADINSecretariaFazendaSPRetornoDto = z.infer<typeof CADINSecretariaFazendaSPRetornoSchema>;
