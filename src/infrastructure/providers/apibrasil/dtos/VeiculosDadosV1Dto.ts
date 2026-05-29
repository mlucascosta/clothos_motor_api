/**
 * @fileoverview DTO de VeiculosDadosV1 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VeiculosDadosV1Dto
 */

import { z } from 'zod';

export const VeiculosDadosV1Schema = z.unknown();

export type VeiculosDadosV1Dto = z.infer<typeof VeiculosDadosV1Schema>;
