/**
 * @fileoverview DTO de CadastroEmpresasInidoneasSuspensas — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroEmpresasInidoneasSuspensasDto
 */

import { z } from 'zod';

export const CadastroEmpresasInidoneasSuspensasRetornoSchema = z.object({
  constamSancoes: z.boolean().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional(),
});

export type CadastroEmpresasInidoneasSuspensasRetornoDto = z.infer<
  typeof CadastroEmpresasInidoneasSuspensasRetornoSchema
>;
