/**
 * @fileoverview DTO de AgregadosRenavamV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosRenavamV2Dto
 */

import { z } from 'zod';

export const AgregadosRenavamV2Schema = z.unknown();

export type AgregadosRenavamV2Dto = z.infer<typeof AgregadosRenavamV2Schema>;
