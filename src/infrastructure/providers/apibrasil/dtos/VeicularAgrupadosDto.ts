/**
 * @fileoverview DTO de VeicularAgrupados — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VeicularAgrupadosDto
 */

import { z } from 'zod';

export const VeicularAgrupadosSchema = z.unknown();

export type VeicularAgrupadosDto = z.infer<typeof VeicularAgrupadosSchema>;
