/**
 * @fileoverview DTO de BaseNacionalOnline — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/BaseNacionalOnlineDto
 */

import { z } from 'zod';

export const BaseNacionalOnlineSchema = z.unknown();

export type BaseNacionalOnlineDto = z.infer<typeof BaseNacionalOnlineSchema>;
