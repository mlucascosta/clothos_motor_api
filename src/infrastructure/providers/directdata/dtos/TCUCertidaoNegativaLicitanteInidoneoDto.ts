/**
 * @fileoverview DTO de TCUCertidaoNegativaLicitanteInidoneo — DirectData.
 * @module infrastructure/providers/directdata/dtos/TCUCertidaoNegativaLicitanteInidoneoDto
 */

import { z } from 'zod';

export const TCUCertidaoNegativaLicitanteInidoneoRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  possuiSancao: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type TCUCertidaoNegativaLicitanteInidoneoRetornoDto = z.infer<
  typeof TCUCertidaoNegativaLicitanteInidoneoRetornoSchema
>;
