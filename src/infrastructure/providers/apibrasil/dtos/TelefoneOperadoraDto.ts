/**
 * @fileoverview DTO de TelefoneOperadora — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/TelefoneOperadoraDto
 */

import { z } from 'zod';

export const TelefoneOperadoraSchema = z.unknown();

export type TelefoneOperadoraDto = z.infer<typeof TelefoneOperadoraSchema>;
