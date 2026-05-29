/**
 * @fileoverview DTO de LeilaoSintetico — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LeilaoSinteticoDto
 */

import { z } from 'zod';

export const LeilaoSinteticoSchema = z.unknown();

export type LeilaoSinteticoDto = z.infer<typeof LeilaoSinteticoSchema>;
