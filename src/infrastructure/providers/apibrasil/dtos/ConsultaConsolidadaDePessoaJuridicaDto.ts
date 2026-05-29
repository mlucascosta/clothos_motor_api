/**
 * @fileoverview DTO de ConsultaConsolidadaDePessoaJuridica — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ConsultaConsolidadaDePessoaJuridicaDto
 */

import { z } from 'zod';

export const ConsultaConsolidadaDePessoaJuridicaSchema = z.unknown();

export type ConsultaConsolidadaDePessoaJuridicaDto = z.infer<typeof ConsultaConsolidadaDePessoaJuridicaSchema>;
