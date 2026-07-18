/**
 * @fileoverview Schemas Zod das fontes Fonte Data (RB-13).
 *
 * Os contratos EXATOS dos endpoints ainda não foram homologados (docs por endpoint são
 * JS-rendered; gate técnico §6 exige chamada real). Até lá, o schema estrutural mínimo
 * garante o invariante que importa: a resposta é um OBJETO JSON — string, array, null ou
 * escalar viram SCHEMA_MISMATCH (payload inesperado → erro, nunca sucesso). Quando cada
 * fonte for homologada (pré-requisito de `is_active=true`), o schema ganha os campos
 * reais SEM mudar o contrato do executor.
 *
 * @module infrastructure/providers/fontedata/dtos/FonteDataDtos
 */

import { z } from 'zod';

/** Resposta-objeto genérica (pré-homologação). */
export const FonteDataObjectSchema = z.record(z.string(), z.unknown());

export type FonteDataObject = z.infer<typeof FonteDataObjectSchema>;

export const CadastroPfBasicaSchema = FonteDataObjectSchema;
export const CadastroPjBasicaSchema = FonteDataObjectSchema;
export const ConsultaCnpjReceitaSchema = FonteDataObjectSchema;

// Fase 1/2 (doc §4/§5) — compliance, judicial, rural e veicular. Aliases nomeados do
// schema estrutural mínimo: ganham os campos reais na homologação (gate técnico §6)
// sem mudar o contrato do executor.
export const CeisSancoesSchema = FonteDataObjectSchema;
export const ProcessosAgrupadaSchema = FonteDataObjectSchema;
export const CarAmbientalSchema = FonteDataObjectSchema;
export const CafirImoveisSchema = FonteDataObjectSchema;
export const ConsultaVeicularSchema = FonteDataObjectSchema;
export const HistoricoVeiculosSchema = FonteDataObjectSchema;
