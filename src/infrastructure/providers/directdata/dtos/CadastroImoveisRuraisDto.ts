/**
 * @fileoverview DTO de CadastroImoveisRurais — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroImoveisRuraisDto
 */

import { z } from 'zod';

export const CadastroImoveisRuraisRetornoSchema = z.object({
  area: z.string().nullable().optional(),
  cadeiaCIB: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  cib: z.string().nullable().optional(),
  codigoINCRA: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  localizacao: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  nomeImovel: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

export type CadastroImoveisRuraisRetornoDto = z.infer<typeof CadastroImoveisRuraisRetornoSchema>;
