/**
 * @fileoverview DTO de CadastroExpulsoesAdministracaoFederal — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroExpulsoesAdministracaoFederalDto
 */

import { z } from 'zod';

export const CadastroExpulsoesAdministracaoFederalRetornoSchema = z.object({
  constamSancoes: z.boolean().nullable().optional(),
  cpf: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  numeroIdentificacao: z.number().int().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional(),
});

export type CadastroExpulsoesAdministracaoFederalRetornoDto = z.infer<
  typeof CadastroExpulsoesAdministracaoFederalRetornoSchema
>;
