/**
 * @fileoverview DTO de ApiRntrc — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ApiRntrcDto
 */

import { z } from 'zod';

export const ApiRntrcSchema = z.unknown();

export type ApiRntrcDto = z.infer<typeof ApiRntrcSchema>;
