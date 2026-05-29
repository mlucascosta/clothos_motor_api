/**
 * @fileoverview DTO de ProprietarioAtualV2 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ProprietarioAtualV2Dto
 */

import { z } from 'zod';

export const ProprietarioAtualV2Schema = z.unknown();

export type ProprietarioAtualV2Dto = z.infer<typeof ProprietarioAtualV2Schema>;
