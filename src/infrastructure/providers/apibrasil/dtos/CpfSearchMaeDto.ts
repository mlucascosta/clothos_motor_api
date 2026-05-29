/**
 * @fileoverview DTO de CpfSearchMae — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfSearchMaeDto
 */

import { z } from 'zod';

export const CpfSearchMaeSchema = z.unknown();

export type CpfSearchMaeDto = z.infer<typeof CpfSearchMaeSchema>;
