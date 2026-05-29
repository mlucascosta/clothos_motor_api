/**
 * @fileoverview DTO de ProtestosNacionalBase — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ProtestosNacionalBaseDto
 */

import { z } from 'zod';

export const ProtestosNacionalBaseSchema = z.unknown();

export type ProtestosNacionalBaseDto = z.infer<typeof ProtestosNacionalBaseSchema>;
