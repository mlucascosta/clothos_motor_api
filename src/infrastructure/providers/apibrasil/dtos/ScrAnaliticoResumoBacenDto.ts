/**
 * @fileoverview DTO de ScrAnaliticoResumoBacen — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ScrAnaliticoResumoBacenDto
 */

import { z } from 'zod';

export const ScrAnaliticoResumoBacenSchema = z.unknown();

export type ScrAnaliticoResumoBacenDto = z.infer<typeof ScrAnaliticoResumoBacenSchema>;
