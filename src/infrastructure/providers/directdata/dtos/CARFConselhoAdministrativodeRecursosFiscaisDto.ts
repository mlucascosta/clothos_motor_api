/**
 * @fileoverview DTO de CARFConselhoAdministrativodeRecursosFiscais — DirectData.
 * @module infrastructure/providers/directdata/dtos/CARFConselhoAdministrativodeRecursosFiscaisDto
 */

import { z } from 'zod';

export const CARFConselhoAdministrativodeRecursosFiscaisRetornoSchema = z.object({
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  totalProcessos: z.number().int().nullable().optional()
});

export type CARFConselhoAdministrativodeRecursosFiscaisRetornoDto = z.infer<typeof CARFConselhoAdministrativodeRecursosFiscaisRetornoSchema>;
