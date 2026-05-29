/**
 * @fileoverview DTO de CheckList — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CheckListDto
 */

import { z } from 'zod';

export const CheckListSchema = z.unknown();

export type CheckListDto = z.infer<typeof CheckListSchema>;
