/**
 * @fileoverview DTO de CnpjCadastral — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CnpjCadastralDto
 */

import { z } from 'zod';

export const CnpjCadastralSchema = z.unknown();

export type CnpjCadastralDto = z.infer<typeof CnpjCadastralSchema>;
