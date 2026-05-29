/**
 * @fileoverview DTO de CertidaoConjuntaDeDebitosPessoaFisica — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CertidaoConjuntaDeDebitosPessoaFisicaDto
 */

import { z } from 'zod';

export const CertidaoConjuntaDeDebitosPessoaFisicaSchema = z.unknown();

export type CertidaoConjuntaDeDebitosPessoaFisicaDto = z.infer<typeof CertidaoConjuntaDeDebitosPessoaFisicaSchema>;
