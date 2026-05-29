/**
 * @fileoverview DTO de Leilao — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LeilaoDto
 */

import { z } from 'zod';

export const LeilaoSchema = z.unknown();

export type LeilaoDto = z.infer<typeof LeilaoSchema>;
