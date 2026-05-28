/**
 * @fileoverview DTO de CVMProcessosAdministrativosSancionadores — DirectData.
 * @module infrastructure/providers/directdata/dtos/CVMProcessosAdministrativosSancionadoresDto
 */

import { z } from 'zod';

export const CVMProcessosAdministrativosSancionadoresRetornoSchema = z.object({
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  possuiProcesso: z.boolean().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  totalProcessos: z.number().int().nullable().optional()
});

export type CVMProcessosAdministrativosSancionadoresRetornoDto = z.infer<typeof CVMProcessosAdministrativosSancionadoresRetornoSchema>;
