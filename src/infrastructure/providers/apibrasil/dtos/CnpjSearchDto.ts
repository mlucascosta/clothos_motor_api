/**
 * @fileoverview DTO de CnpjSearch — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CnpjSearchDto
 */

import { z } from 'zod';

export const CnpjSearchSchema = z.unknown();

export type CnpjSearchDto = z.infer<typeof CnpjSearchSchema>;
