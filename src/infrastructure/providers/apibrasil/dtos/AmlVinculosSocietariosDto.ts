/**
 * @fileoverview DTO de AmlVinculosSocietarios — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AmlVinculosSocietariosDto
 */

import { z } from 'zod';

export const AmlVinculosSocietariosSchema = z.unknown();

export type AmlVinculosSocietariosDto = z.infer<typeof AmlVinculosSocietariosSchema>;
