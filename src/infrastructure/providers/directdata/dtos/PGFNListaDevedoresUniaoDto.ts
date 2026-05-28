/**
 * @fileoverview DTO de PGFNListaDevedoresUniao — DirectData.
 * @module infrastructure/providers/directdata/dtos/PGFNListaDevedoresUniaoDto
 */

import { z } from 'zod';

export const PGFNListaDevedoresUniaoRetornoSchema = z.object({
  cnae: z.string().nullable().optional(),
  cnaeDescricao: z.string().nullable().optional(),
  codigoMunicipio: z.number().int().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  naturezas: z.array(z.record(z.unknown())).nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMunicipio: z.string().nullable().optional(),
  possuiDivida: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  tipoDevedor: z.string().nullable().optional(),
  tipoPessoa: z.string().nullable().optional(),
  totalDivida: z.number().nullable().optional(),
  totalPrevidenciario: z.number().nullable().optional(),
  totalTributario: z.number().nullable().optional(),
  uf: z.string().nullable().optional(),
  unidadeResponsavel: z.string().nullable().optional()
});

export type PGFNListaDevedoresUniaoRetornoDto = z.infer<typeof PGFNListaDevedoresUniaoRetornoSchema>;
