/**
 * @fileoverview DTO de AgregadosRenavam — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AgregadosRenavamDto
 */

import { z } from 'zod';

export const AgregadosRenavamSchema = z.unknown();

export type AgregadosRenavamDto = z.infer<typeof AgregadosRenavamSchema>;
