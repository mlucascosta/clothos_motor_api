/**
 * @fileoverview DTO de ChipVirtual — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ChipVirtualDto
 */

import { z } from 'zod';

export const ChipVirtualSchema = z.unknown();

export type ChipVirtualDto = z.infer<typeof ChipVirtualSchema>;
