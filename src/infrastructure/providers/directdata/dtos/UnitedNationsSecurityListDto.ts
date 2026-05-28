/**
 * @fileoverview DTO de UnitedNationsSecurityList — DirectData.
 * @module infrastructure/providers/directdata/dtos/UnitedNationsSecurityListDto
 */

import { z } from 'zod';

export const UnitedNationsSecurityListRetornoSchema = z.object({
  nomeConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  resultadosEncontrados: z.number().int().nullable().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional()
});

export type UnitedNationsSecurityListRetornoDto = z.infer<typeof UnitedNationsSecurityListRetornoSchema>;
