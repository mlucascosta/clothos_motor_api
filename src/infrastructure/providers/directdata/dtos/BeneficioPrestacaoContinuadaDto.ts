/**
 * @fileoverview DTO de BeneficioPrestacaoContinuada — DirectData.
 * @module infrastructure/providers/directdata/dtos/BeneficioPrestacaoContinuadaDto
 */

import { z } from 'zod';

export const BeneficioPrestacaoContinuadaRetornoSchema = z.object({
  beneficioConcedidoJudicialmente: z.boolean().nullable().optional(),
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
});

export type BeneficioPrestacaoContinuadaRetornoDto = z.infer<
  typeof BeneficioPrestacaoContinuadaRetornoSchema
>;
