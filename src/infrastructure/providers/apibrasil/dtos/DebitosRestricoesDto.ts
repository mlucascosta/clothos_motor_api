/**
 * @fileoverview DTO de DebitosRestricoes — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DebitosRestricoesDto
 */

import { z } from 'zod';

export const DebitosRestricoesSchema = z.unknown();

export type DebitosRestricoesDto = z.infer<typeof DebitosRestricoesSchema>;
