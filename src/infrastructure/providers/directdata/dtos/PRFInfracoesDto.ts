/**
 * @fileoverview DTO de PRFInfracoes — DirectData.
 * @module infrastructure/providers/directdata/dtos/PRFInfracoesDto
 */

import { z } from 'zod';

export const PRFInfracoesRetornoSchema = z.object({
  infracoes: z.array(z.record(z.unknown())).nullable().optional(),
  licenciadoExterior: z.boolean().nullable().optional(),
  nomeDestinatario: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  placa: z.string().nullable().optional(),
  possuiInfracao: z.boolean().nullable().optional(),
  renavam: z.string().nullable().optional(),
  tipoConsultado: z.string().nullable().optional(),
  ufPlaca: z.string().nullable().optional()
});

export type PRFInfracoesRetornoDto = z.infer<typeof PRFInfracoesRetornoSchema>;
