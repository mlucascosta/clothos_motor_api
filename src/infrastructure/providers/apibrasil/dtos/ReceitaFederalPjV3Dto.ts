/**
 * @fileoverview DTO de ReceitaFederalPjV3 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ReceitaFederalPjV3Dto
 */

import { z } from 'zod';

export const ReceitaFederalPjV3Schema = z.unknown();

export type ReceitaFederalPjV3Dto = z.infer<typeof ReceitaFederalPjV3Schema>;
