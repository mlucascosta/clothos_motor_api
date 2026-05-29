/**
 * @fileoverview DTO de FichaTecnica — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/FichaTecnicaDto
 */

import { z } from 'zod';

export const FichaTecnicaSchema = z.unknown();

export type FichaTecnicaDto = z.infer<typeof FichaTecnicaSchema>;
