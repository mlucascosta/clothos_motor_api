/**
 * @fileoverview DTO de ProxyBuy — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ProxyBuyDto
 */

import { z } from 'zod';

export const ProxyBuySchema = z.unknown();

export type ProxyBuyDto = z.infer<typeof ProxyBuySchema>;
