/**
 * @fileoverview DTO de CertidaoConjuntaDeDebitosPessoaJuridica — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CertidaoConjuntaDeDebitosPessoaJuridicaDto
 */

import { z } from 'zod';

export const CertidaoConjuntaDeDebitosPessoaJuridicaSchema = z.unknown();

export type CertidaoConjuntaDeDebitosPessoaJuridicaDto = z.infer<
  typeof CertidaoConjuntaDeDebitosPessoaJuridicaSchema
>;
