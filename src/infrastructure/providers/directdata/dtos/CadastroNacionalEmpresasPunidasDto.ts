/**
 * @fileoverview DTO de CadastroNacionalEmpresasPunidas — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroNacionalEmpresasPunidasDto
 */

import { z } from 'zod';

export const CadastroNacionalEmpresasPunidasRetornoSchema = z.object({
  constamSancoes: z.boolean().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional()
});

export type CadastroNacionalEmpresasPunidasRetornoDto = z.infer<typeof CadastroNacionalEmpresasPunidasRetornoSchema>;
