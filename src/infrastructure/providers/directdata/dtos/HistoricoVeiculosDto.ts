/**
 * @fileoverview DTO de HistoricoVeiculos — DirectData.
 * @module infrastructure/providers/directdata/dtos/HistoricoVeiculosDto
 */

import { z } from 'zod';

export const HistoricoVeiculosRetornoSchema = z.object({
  documento: z.string().nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  proprietario: z.string().nullable().optional(),
  veiculos: z.array(z.record(z.unknown())).nullable().optional(),
});

export type HistoricoVeiculosRetornoDto = z.infer<typeof HistoricoVeiculosRetornoSchema>;
