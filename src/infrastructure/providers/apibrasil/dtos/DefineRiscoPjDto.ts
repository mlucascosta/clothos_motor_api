/**
 * @fileoverview DTO de DefineRiscoPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DefineRiscoPjDto
 */

import { z } from 'zod';

export const DefineRiscoPjSchema = z.unknown();

export type DefineRiscoPjDto = z.infer<typeof DefineRiscoPjSchema>;
