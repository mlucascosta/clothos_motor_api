/**
 * @fileoverview DTO de CadastroReceitaPessoaFisica — DirectData.
 * @module infrastructure/providers/directdata/dtos/CadastroReceitaPessoaFisicaDto
 */

import { z } from 'zod';

export const CadastroReceitaPessoaFisicaRetornoSchema = z.object({
  cadastro: z.record(z.unknown()),
  receita: z.record(z.unknown())
});

export type CadastroReceitaPessoaFisicaRetornoDto = z.infer<typeof CadastroReceitaPessoaFisicaRetornoSchema>;
