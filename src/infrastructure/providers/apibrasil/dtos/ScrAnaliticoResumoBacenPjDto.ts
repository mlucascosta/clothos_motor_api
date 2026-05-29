/**
 * @fileoverview DTO de ScrAnaliticoResumoBacenPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ScrAnaliticoResumoBacenPjDto
 */

import { z } from 'zod';

export const ScrAnaliticoResumoBacenPjSchema = z.unknown();

export type ScrAnaliticoResumoBacenPjDto = z.infer<typeof ScrAnaliticoResumoBacenPjSchema>;
