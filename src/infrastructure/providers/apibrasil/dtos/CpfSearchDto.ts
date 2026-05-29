/**
 * @fileoverview DTO de CpfSearch — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfSearchDto
 */

import { z } from 'zod';

export const CpfSearchSchema = z.unknown();

export type CpfSearchDto = z.infer<typeof CpfSearchSchema>;
