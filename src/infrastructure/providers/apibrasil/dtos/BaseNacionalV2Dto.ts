/**
 * @fileoverview DTO de BaseNacionalV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/BaseNacionalV2Dto
 */

import { z } from 'zod';

export const BaseNacionalV2Schema = z.unknown();

export type BaseNacionalV2Dto = z.infer<typeof BaseNacionalV2Schema>;
