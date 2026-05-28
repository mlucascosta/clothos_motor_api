/**
 * @fileoverview DTO de SCRBacen — DirectData.
 * @module infrastructure/providers/directdata/dtos/SCRBacenDto
 */

import { z } from 'zod';

export const SCRBacenRetornoSchema = z.object({
  carteiraCredito: z.record(z.unknown()),
  classeRisco: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  indice: z.record(z.unknown()),
  percentualCategoria: z.record(z.unknown()),
  percentualEvolucaoCompromisso: z.record(z.unknown()),
  percentualPrazo: z.record(z.unknown()),
  percentualVencido: z.record(z.unknown()),
  perfil: z.string().nullable().optional(),
  quantidadeInstituicoes: z.number().int().nullable().optional(),
  quantidadeOperacoes: z.number().int().nullable().optional(),
  relacionamentos: z.string().nullable().optional(),
  score: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  volume: z.string().nullable().optional()
});

export type SCRBacenRetornoDto = z.infer<typeof SCRBacenRetornoSchema>;
