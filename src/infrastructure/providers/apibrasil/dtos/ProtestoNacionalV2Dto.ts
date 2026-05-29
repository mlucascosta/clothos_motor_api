/**
 * @fileoverview DTO de ProtestoNacionalV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ProtestoNacionalV2Dto
 */

import { z } from 'zod';

export const ProtestoNacionalV2Schema = z.unknown();

export type ProtestoNacionalV2Dto = z.infer<typeof ProtestoNacionalV2Schema>;
