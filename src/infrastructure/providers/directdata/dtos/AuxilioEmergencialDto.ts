/**
 * @fileoverview DTO de AuxilioEmergencial — DirectData.
 * @module infrastructure/providers/directdata/dtos/AuxilioEmergencialDto
 */

import { z } from 'zod';

export const AuxilioEmergencialRetornoSchema = z.object({
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional()
});

export type AuxilioEmergencialRetornoDto = z.infer<typeof AuxilioEmergencialRetornoSchema>;
