/**
 * @fileoverview DTO de VinculoEmpregaticio — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VinculoEmpregaticioDto
 */

import { z } from 'zod';

export const VinculoEmpregaticioSchema = z.unknown();

export type VinculoEmpregaticioDto = z.infer<typeof VinculoEmpregaticioSchema>;
