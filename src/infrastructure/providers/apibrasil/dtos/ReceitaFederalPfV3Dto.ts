/**
 * @fileoverview DTO de ReceitaFederalPfV3 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ReceitaFederalPfV3Dto
 */

import { z } from 'zod';

export const ReceitaFederalPfV3Schema = z.unknown();

export type ReceitaFederalPfV3Dto = z.infer<typeof ReceitaFederalPfV3Schema>;
