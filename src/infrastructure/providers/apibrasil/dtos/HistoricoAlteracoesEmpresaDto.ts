/**
 * @fileoverview DTO de HistoricoAlteracoesEmpresa — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/HistoricoAlteracoesEmpresaDto
 */

import { z } from 'zod';

export const HistoricoAlteracoesEmpresaSchema = z.unknown();

export type HistoricoAlteracoesEmpresaDto = z.infer<typeof HistoricoAlteracoesEmpresaSchema>;
