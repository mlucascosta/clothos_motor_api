/**
 * @fileoverview DTO de DebitosV4 — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DebitosV4Dto
 */

import { z } from 'zod';

export const DebitosV4Schema = z.unknown();

export type DebitosV4Dto = z.infer<typeof DebitosV4Schema>;
