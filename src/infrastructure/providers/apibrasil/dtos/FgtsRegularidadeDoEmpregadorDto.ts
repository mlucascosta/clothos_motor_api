/**
 * @fileoverview DTO de FgtsRegularidadeDoEmpregador — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/FgtsRegularidadeDoEmpregadorDto
 */

import { z } from 'zod';

export const FgtsRegularidadeDoEmpregadorSchema = z.unknown();

export type FgtsRegularidadeDoEmpregadorDto = z.infer<typeof FgtsRegularidadeDoEmpregadorSchema>;
