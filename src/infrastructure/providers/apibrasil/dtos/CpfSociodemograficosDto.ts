/**
 * @fileoverview DTO de CpfSociodemograficos — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfSociodemograficosDto
 */

import { z } from 'zod';

export const CpfSociodemograficosSchema = z.unknown();

export type CpfSociodemograficosDto = z.infer<typeof CpfSociodemograficosSchema>;
