/**
 * @fileoverview DTO de CVMComissaodeValoresMobiliarios — DirectData.
 * @module infrastructure/providers/directdata/dtos/CVMComissaodeValoresMobiliariosDto
 */

import { z } from 'zod';

export const CVMComissaodeValoresMobiliariosRetornoSchema = z.object({
  bairro: z.string().nullable().optional(),
  categoria: z.string().nullable().optional(),
  categoriaRegistro: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  cidade: z.string().nullable().optional(),
  codigoCVM: z.string().nullable().optional(),
  companhiaDeMenorPorte: z.string().nullable().optional(),
  dataInicioNaCategoria: z.string().nullable().optional(),
  dataPatrimonioLiquido: z.string().nullable().optional(),
  dataRegistro: z.string().nullable().optional(),
  dataSituacao: z.string().nullable().optional(),
  diretores: z.array(z.record(z.unknown())).nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  endereco: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  patrimonioLiquido: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  tiposParticipante: z.array(z.record(z.unknown())).nullable().optional(),
  uf: z.string().nullable().optional(),
  website: z.string().nullable().optional()
});

export type CVMComissaodeValoresMobiliariosRetornoDto = z.infer<typeof CVMComissaodeValoresMobiliariosRetornoSchema>;
