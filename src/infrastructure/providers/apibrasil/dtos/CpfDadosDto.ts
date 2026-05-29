/**
 * @fileoverview DTO de CpfDados — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfDadosDto
 */

import { z } from 'zod';

export const CpfDadosSchema = z.unknown();

export type CpfDadosDto = z.infer<typeof CpfDadosSchema>;
