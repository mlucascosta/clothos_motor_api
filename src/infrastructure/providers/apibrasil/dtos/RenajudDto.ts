/**
 * @fileoverview DTO de Renajud — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RenajudDto
 */

import { z } from 'zod';

export const RenajudSchema = z.unknown();

export type RenajudDto = z.infer<typeof RenajudSchema>;
