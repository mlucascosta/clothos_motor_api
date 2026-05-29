/**
 * @fileoverview DTO de ReceitaFederalPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ReceitaFederalPfDto
 */

import { z } from 'zod';

export const ReceitaFederalPfSchema = z.unknown();

export type ReceitaFederalPfDto = z.infer<typeof ReceitaFederalPfSchema>;
