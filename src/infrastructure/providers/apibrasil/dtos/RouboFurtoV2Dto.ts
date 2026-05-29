/**
 * @fileoverview DTO de RouboFurtoV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RouboFurtoV2Dto
 */

import { z } from 'zod';

export const RouboFurtoV2Schema = z.unknown();

export type RouboFurtoV2Dto = z.infer<typeof RouboFurtoV2Schema>;
