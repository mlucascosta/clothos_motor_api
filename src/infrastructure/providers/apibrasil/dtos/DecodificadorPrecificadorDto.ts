/**
 * @fileoverview DTO de DecodificadorPrecificador — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DecodificadorPrecificadorDto
 */

import { z } from 'zod';

export const DecodificadorPrecificadorSchema = z.unknown();

export type DecodificadorPrecificadorDto = z.infer<typeof DecodificadorPrecificadorSchema>;
