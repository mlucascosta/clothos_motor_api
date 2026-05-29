/**
 * @fileoverview DTO de AgregadosBasica — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosBasicaDto
 */

import { z } from 'zod';

export const AgregadosBasicaSchema = z.unknown();

export type AgregadosBasicaDto = z.infer<typeof AgregadosBasicaSchema>;
