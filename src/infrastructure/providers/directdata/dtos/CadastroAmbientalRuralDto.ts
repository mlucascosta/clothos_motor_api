/**
 * @fileoverview DTO de CadastroAmbientalRural — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroAmbientalRuralDto
 */

import { z } from 'zod';

export const CadastroAmbientalRuralRetornoSchema = z.object({
  app: z.record(z.unknown()),
  coberturaSolo: z.record(z.unknown()),
  condicaoExterna: z.string().nullable().optional(),
  dadosImovel: z.record(z.unknown()),
  dataConsulta: z.string().nullable().optional(),
  informacoesAdicionais: z.array(z.record(z.unknown())).nullable().optional(),
  inscricaoCAR: z.string().nullable().optional(),
  reservaLegal: z.record(z.unknown()),
  situacaoCadastro: z.string().nullable().optional(),
  usoRestrito: z.record(z.unknown())
});

export type CadastroAmbientalRuralRetornoDto = z.infer<typeof CadastroAmbientalRuralRetornoSchema>;
