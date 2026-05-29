/**
 * @fileoverview DTO de AgregadosChassi — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosChassiDto
 */

import { z } from 'zod';

export const AgregadosChassiSchema = z.unknown();

export type AgregadosChassiDto = z.infer<typeof AgregadosChassiSchema>;
