/**
 * @fileoverview DTO de TCUConsultaConsolidadaPessoaJuridica — DirectData.
 * @module infrastructure/providers/directdata/dtos/TCUConsultaConsolidadaPessoaJuridicaDto
 */

import { z } from 'zod';

export const TCUConsultaConsolidadaPessoaJuridicaRetornoSchema = z.object({
  certidoes: z.array(z.record(z.unknown())).nullable().optional(),
  cnpj: z.string().nullable().optional(),
  constamSancoes: z.boolean().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  uf: z.string().nullable().optional()
});

export type TCUConsultaConsolidadaPessoaJuridicaRetornoDto = z.infer<typeof TCUConsultaConsolidadaPessoaJuridicaRetornoSchema>;
