/**
 * @fileoverview DTO de Estadual — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/EstadualDto
 */

import { z } from 'zod';

export const EstadualSchema = z.unknown();

export type EstadualDto = z.infer<typeof EstadualSchema>;
