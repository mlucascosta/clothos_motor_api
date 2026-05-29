/**
 * @fileoverview DTO de FreteAntt — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/FreteAnttDto
 */

import { z } from 'zod';

export const FreteAnttSchema = z.unknown();

export type FreteAnttDto = z.infer<typeof FreteAnttSchema>;
