/**
 * @fileoverview DTO de DividaAtiva — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DividaAtivaDto
 */

import { z } from 'zod';

export const DividaAtivaSchema = z.unknown();

export type DividaAtivaDto = z.infer<typeof DividaAtivaSchema>;
