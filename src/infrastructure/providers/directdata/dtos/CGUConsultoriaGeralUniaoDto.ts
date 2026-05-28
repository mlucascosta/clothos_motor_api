/**
 * @fileoverview DTO de CGUConsultoriaGeralUniao — DirectData.
 * @module infrastructure/providers/directdata/dtos/CGUConsultoriaGeralUniaoDto
 */

import { z } from 'zod';

export const CGUConsultoriaGeralUniaoRetornoSchema = z.object({
  codigoControle: z.string().nullable().optional(),
  constamCorrecionais: z.boolean().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  restricoesCGU: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional(),
  tipoConsultado: z.string().nullable().optional()
});

export type CGUConsultoriaGeralUniaoRetornoDto = z.infer<typeof CGUConsultoriaGeralUniaoRetornoSchema>;
