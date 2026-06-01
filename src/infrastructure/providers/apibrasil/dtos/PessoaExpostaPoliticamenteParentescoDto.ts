/**
 * @fileoverview DTO de PessoaExpostaPoliticamenteParentesco — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/PessoaExpostaPoliticamenteParentescoDto
 */

import { z } from 'zod';

export const PessoaExpostaPoliticamenteParentescoSchema = z.unknown();

export type PessoaExpostaPoliticamenteParentescoDto = z.infer<
  typeof PessoaExpostaPoliticamenteParentescoSchema
>;
