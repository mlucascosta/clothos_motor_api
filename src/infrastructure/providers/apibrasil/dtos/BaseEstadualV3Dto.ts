/**
 * @fileoverview DTO de BaseEstadualV3 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/BaseEstadualV3Dto
 */

import { z } from 'zod';

export const BaseEstadualV3Schema = z.unknown();

export type BaseEstadualV3Dto = z.infer<typeof BaseEstadualV3Schema>;
