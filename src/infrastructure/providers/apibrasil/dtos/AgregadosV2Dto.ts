/**
 * @fileoverview DTO de AgregadosV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosV2Dto
 */

import { z } from 'zod';

export const AgregadosV2Schema = z.unknown();

export type AgregadosV2Dto = z.infer<typeof AgregadosV2Schema>;
