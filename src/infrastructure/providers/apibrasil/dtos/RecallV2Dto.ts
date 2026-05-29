/**
 * @fileoverview DTO de RecallV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RecallV2Dto
 */

import { z } from 'zod';

export const RecallV2Schema = z.unknown();

export type RecallV2Dto = z.infer<typeof RecallV2Schema>;
