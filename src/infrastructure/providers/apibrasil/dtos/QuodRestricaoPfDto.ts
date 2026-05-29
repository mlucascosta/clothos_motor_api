/**
 * @fileoverview DTO de QuodRestricaoPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/QuodRestricaoPfDto
 */

import { z } from 'zod';

export const QuodRestricaoPfSchema = z.unknown();

export type QuodRestricaoPfDto = z.infer<typeof QuodRestricaoPfSchema>;
