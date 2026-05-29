/**
 * @fileoverview DTO de CpfImpedidos — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfImpedidosDto
 */

import { z } from 'zod';

export const CpfImpedidosSchema = z.unknown();

export type CpfImpedidosDto = z.infer<typeof CpfImpedidosSchema>;
