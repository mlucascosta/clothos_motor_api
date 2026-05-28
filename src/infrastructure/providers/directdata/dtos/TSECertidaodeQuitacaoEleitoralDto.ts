/**
 * @fileoverview DTO de TSECertidaodeQuitacaoEleitoral — DirectData.
 * @module infrastructure/providers/directdata/dtos/TSECertidaodeQuitacaoEleitoralDto
 */

import { z } from 'zod';

export const TSECertidaodeQuitacaoEleitoralRetornoSchema = z.object({
  dataNascimento: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  domicilioDesde: z.string().nullable().optional(),
  filiacao: z.string().nullable().optional(),
  inscricao: z.string().nullable().optional(),
  isRegular: z.boolean().nullable().optional(),
  municipio: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  ocupacaoDeclarada: z.string().nullable().optional(),
  secao: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  zona: z.string().nullable().optional()
});

export type TSECertidaodeQuitacaoEleitoralRetornoDto = z.infer<typeof TSECertidaodeQuitacaoEleitoralRetornoSchema>;
