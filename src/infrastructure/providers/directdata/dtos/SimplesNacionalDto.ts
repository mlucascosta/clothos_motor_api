/**
 * @fileoverview DTO de SimplesNacional — DirectData.
 * @module infrastructure/providers/directdata/dtos/SimplesNacionalDto
 */

import { z } from 'zod';

export const SimplesNacionalRetornoSchema = z.object({
  cnpj: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  enquadradoSIMEI: z.boolean().optional(),
  eventosFuturosSIMEI: z.array(z.record(z.unknown())).nullable().optional(),
  eventosFuturosSimplesNacional: z.array(z.record(z.unknown())).nullable().optional(),
  meiTransportadorAutonomo: z.array(z.record(z.unknown())).nullable().optional(),
  nomeEmpresarial: z.string().nullable().optional(),
  optanteSimplesNacional: z.boolean().optional(),
  simeiPeriodosAnteriores: z.array(z.record(z.unknown())).nullable().optional(),
  simplesNacionalPeriodosAnteriores: z.array(z.record(z.unknown())).nullable().optional(),
  situacaoSIMEI: z.string().nullable().optional(),
  situacaoSimplesNacional: z.string().nullable().optional(),
});

export type SimplesNacionalRetornoDto = z.infer<typeof SimplesNacionalRetornoSchema>;
