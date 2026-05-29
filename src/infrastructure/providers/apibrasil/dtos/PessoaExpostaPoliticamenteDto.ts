/**
 * @fileoverview DTO de PessoaExpostaPoliticamente — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/PessoaExpostaPoliticamenteDto
 */

import { z } from 'zod';

export const PessoaExpostaPoliticamenteSchema = z.unknown();

export type PessoaExpostaPoliticamenteDto = z.infer<typeof PessoaExpostaPoliticamenteSchema>;
