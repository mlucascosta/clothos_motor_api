/**
 * @fileoverview DTO de AcordosLeniencia — DirectData.
 * @module infrastructure/providers/directdata/dtos/AcordosLenienciaDto
 */

import { z } from 'zod';

export const AcordosLenienciaRetornoSchema = z.object({
  acordos: z.array(z.record(z.unknown())).nullable().optional(),
  constamAcordos: z.boolean().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  quantidadeAcordos: z.number().int().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  totalSancoes: z.number().int().nullable().optional(),
});

export type AcordosLenienciaRetornoDto = z.infer<typeof AcordosLenienciaRetornoSchema>;
