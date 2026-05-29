/**
 * @fileoverview DTO de SpcBoaVista — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SpcBoaVistaDto
 */

import { z } from 'zod';

export const SpcBoaVistaSchema = z.unknown();

export type SpcBoaVistaDto = z.infer<typeof SpcBoaVistaSchema>;
