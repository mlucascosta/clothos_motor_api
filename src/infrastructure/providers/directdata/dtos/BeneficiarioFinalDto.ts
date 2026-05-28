/**
 * @fileoverview DTO de BeneficiarioFinal — DirectData.
 * @module infrastructure/providers/directdata/dtos/BeneficiarioFinalDto
 */

import { z } from 'zod';

export const BeneficiarioFinalRetornoSchema = z.object({
  dataCadastro: z.string().nullable().optional(),
  dataUpdate: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeRazaoSocial: z.string().nullable().optional(),
  pepMatriz: z.boolean().nullable().optional(),
  sociedades: z.array(z.record(z.unknown())).nullable().optional()
});

export type BeneficiarioFinalRetornoDto = z.infer<typeof BeneficiarioFinalRetornoSchema>;
