/**
 * @fileoverview DTO de ReceitaFederal — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ReceitaFederalDto
 */

import { z } from 'zod';

export const ReceitaFederalSchema = z.unknown();

export type ReceitaFederalDto = z.infer<typeof ReceitaFederalSchema>;
