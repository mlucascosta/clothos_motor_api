/**
 * @fileoverview DTO de AgregadosIndicioSinistro — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosIndicioSinistroDto
 */

import { z } from 'zod';

export const AgregadosIndicioSinistroSchema = z.unknown();

export type AgregadosIndicioSinistroDto = z.infer<typeof AgregadosIndicioSinistroSchema>;
