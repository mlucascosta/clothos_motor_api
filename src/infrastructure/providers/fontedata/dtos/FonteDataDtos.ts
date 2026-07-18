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
