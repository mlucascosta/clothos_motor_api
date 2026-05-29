/**
 * @fileoverview DTO de CpfHotline — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfHotlineDto
 */

import { z } from 'zod';

export const CpfHotlineSchema = z.unknown();

export type CpfHotlineDto = z.infer<typeof CpfHotlineSchema>;
