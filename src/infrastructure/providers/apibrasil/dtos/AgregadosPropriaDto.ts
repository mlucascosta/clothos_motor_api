/**
 * @fileoverview DTO de AgregadosPropria — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosPropriaDto
 */

import { z } from 'zod';

export const AgregadosPropriaSchema = z.unknown();

export type AgregadosPropriaDto = z.infer<typeof AgregadosPropriaSchema>;
