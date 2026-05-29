/**
 * @fileoverview DTO de BancoCentralInabilitados — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/BancoCentralInabilitadosDto
 */

import { z } from 'zod';

export const BancoCentralInabilitadosSchema = z.unknown();

export type BancoCentralInabilitadosDto = z.infer<typeof BancoCentralInabilitadosSchema>;
