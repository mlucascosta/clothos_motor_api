/**
 * @fileoverview DTO de ProtestosSp — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ProtestosSpDto
 */

import { z } from 'zod';

export const ProtestosSpSchema = z.unknown();

export type ProtestosSpDto = z.infer<typeof ProtestosSpSchema>;
