/**
 * @fileoverview DTO de CadastroEntidadesPrivadasImpedidas — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroEntidadesPrivadasImpedidasDto
 */

import { z } from 'zod';

export const CadastroEntidadesPrivadasImpedidasRetornoSchema = z.object({
  cnpj: z.string().nullable().optional(),
  constamSancoes: z.boolean().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional()
});

export type CadastroEntidadesPrivadasImpedidasRetornoDto = z.infer<typeof CadastroEntidadesPrivadasImpedidasRetornoSchema>;
