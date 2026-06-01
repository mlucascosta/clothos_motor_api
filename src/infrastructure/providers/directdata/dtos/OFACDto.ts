/**
 * @fileoverview DTO de OFAC — DirectData.
 * @module infrastructure/providers/directdata/dtos/OFACDto
 */

import { z } from 'zod';

export const OFACRetornoSchema = z.object({
  dataListaNONSDN: z.string().nullable().optional(),
  dataListaSDN: z.string().nullable().optional(),
  nomeConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  resultadosEncontrados: z.number().int().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional(),
});

export type OFACRetornoDto = z.infer<typeof OFACRetornoSchema>;
