/**
 * @fileoverview DTO de LeilaoConjugado — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LeilaoConjugadoDto
 */

import { z } from 'zod';

export const LeilaoConjugadoSchema = z.unknown();

export type LeilaoConjugadoDto = z.infer<typeof LeilaoConjugadoSchema>;
