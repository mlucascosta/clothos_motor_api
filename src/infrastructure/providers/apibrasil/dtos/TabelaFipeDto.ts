/**
 * @fileoverview DTO de TabelaFipe — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/TabelaFipeDto
 */

import { z } from 'zod';

export const TabelaFipeSchema = z.unknown();

export type TabelaFipeDto = z.infer<typeof TabelaFipeSchema>;
