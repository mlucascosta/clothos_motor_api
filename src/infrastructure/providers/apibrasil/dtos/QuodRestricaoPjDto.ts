/**
 * @fileoverview DTO de QuodRestricaoPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/QuodRestricaoPjDto
 */

import { z } from 'zod';

export const QuodRestricaoPjSchema = z.unknown();

export type QuodRestricaoPjDto = z.infer<typeof QuodRestricaoPjSchema>;
