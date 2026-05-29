/**
 * @fileoverview DTO de DecodificadorAgregados — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DecodificadorAgregadosDto
 */

import { z } from 'zod';

export const DecodificadorAgregadosSchema = z.unknown();

export type DecodificadorAgregadosDto = z.infer<typeof DecodificadorAgregadosSchema>;
