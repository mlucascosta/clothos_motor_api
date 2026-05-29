/**
 * @fileoverview DTO de LeilaoV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LeilaoV2Dto
 */

import { z } from 'zod';

export const LeilaoV2Schema = z.unknown();

export type LeilaoV2Dto = z.infer<typeof LeilaoV2Schema>;
