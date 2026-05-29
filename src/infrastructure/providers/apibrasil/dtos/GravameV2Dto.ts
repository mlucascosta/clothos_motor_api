/**
 * @fileoverview DTO de GravameV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/GravameV2Dto
 */

import { z } from 'zod';

export const GravameV2Schema = z.unknown();

export type GravameV2Dto = z.infer<typeof GravameV2Schema>;
