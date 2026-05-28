/**
 * @fileoverview DTO de TribunalJustica — DirectData.
 * @module infrastructure/providers/directdata/dtos/TribunalJusticaDto
 */

import { z } from 'zod';

export const TribunalJusticaRetornoSchema = z.object({
  dataConsulta: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  grau: z.number().int().nullable().optional(),
  nomeParte: z.string().nullable().optional(),
  numeroProcesso: z.string().nullable().optional(),
  primeiroGrau: z.record(z.unknown()),
  segundoGrau: z.record(z.unknown()),
  status: z.string().nullable().optional(),
  uf: z.string().nullable().optional()
});

export type TribunalJusticaRetornoDto = z.infer<typeof TribunalJusticaRetornoSchema>;
