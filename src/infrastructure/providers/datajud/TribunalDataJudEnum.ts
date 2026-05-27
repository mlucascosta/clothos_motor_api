/**
 * @fileoverview Enum com todos os tribunais da API Pública DataJud (CNJ).
 * Usado para type-safety e autocomplete em consultas.
 * @module infrastructure/providers/datajud/TribunalDataJudEnum
 */

import { z } from 'zod';

/**
 * Enum de tribunais disponíveis na API Pública DataJud.
 * Contém 91 unidades jurisdicionais.
 *
 * @enum {string}
 */
export enum TribunalDataJudEnum {
  // Tribunais Superiores
  TST = 'tst',
  TSE = 'tse',
  STJ = 'stj',
  STM = 'stm',

  // Justiça Federal — TRFs
  TRF1 = 'trf1',
  TRF2 = 'trf2',
  TRF3 = 'trf3',
  TRF4 = 'trf4',
  TRF5 = 'trf5',
  TRF6 = 'trf6',

  // Justiça Estadual — TJs
  TJAC = 'tjac',
  TJAL = 'tjal',
  TJAM = 'tjam',
  TJAP = 'tjap',
  TJBA = 'tjba',
  TJCE = 'tjce',
  TJDFT = 'tjdft',
  TJES = 'tjes',
  TJGO = 'tjgo',
  TJMA = 'tjma',
  TJMG = 'tjmg',
  TJMS = 'tjms',
  TJMT = 'tjmt',
  TJPA = 'tjpa',
  TJPB = 'tjpb',
  TJPE = 'tjpe',
  TJPI = 'tjpi',
  TJPR = 'tjpr',
  TJRJ = 'tjrj',
  TJRN = 'tjrn',
  TJRO = 'tjro',
  TJRR = 'tjrr',
  TJRS = 'tjrs',
  TJSC = 'tjsc',
  TJSE = 'tjse',
  TJSP = 'tjsp',
  TJTO = 'tjto',

  // Justiça do Trabalho — TRTs
  TRT1 = 'trt1',
  TRT2 = 'trt2',
  TRT3 = 'trt3',
  TRT4 = 'trt4',
  TRT5 = 'trt5',
  TRT6 = 'trt6',
  TRT7 = 'trt7',
  TRT8 = 'trt8',
  TRT9 = 'trt9',
  TRT10 = 'trt10',
  TRT11 = 'trt11',
  TRT12 = 'trt12',
  TRT13 = 'trt13',
  TRT14 = 'trt14',
  TRT15 = 'trt15',
  TRT16 = 'trt16',
  TRT17 = 'trt17',
  TRT18 = 'trt18',
  TRT19 = 'trt19',
  TRT20 = 'trt20',
  TRT21 = 'trt21',
  TRT22 = 'trt22',
  TRT23 = 'trt23',
  TRT24 = 'trt24',

  // Justiça Eleitoral — TREs
  TRE_AC = 'tre-ac',
  TRE_AL = 'tre-al',
  TRE_AM = 'tre-am',
  TRE_AP = 'tre-ap',
  TRE_BA = 'tre-ba',
  TRE_CE = 'tre-ce',
  TRE_DFT = 'tre-dft',
  TRE_ES = 'tre-es',
  TRE_GO = 'tre-go',
  TRE_MA = 'tre-ma',
  TRE_MG = 'tre-mg',
  TRE_MS = 'tre-ms',
  TRE_MT = 'tre-mt',
  TRE_PA = 'tre-pa',
  TRE_PB = 'tre-pb',
  TRE_PE = 'tre-pe',
  TRE_PI = 'tre-pi',
  TRE_PR = 'tre-pr',
  TRE_RJ = 'tre-rj',
  TRE_RN = 'tre-rn',
  TRE_RO = 'tre-ro',
  TRE_RR = 'tre-rr',
  TRE_RS = 'tre-rs',
  TRE_SC = 'tre-sc',
  TRE_SE = 'tre-se',
  TRE_SP = 'tre-sp',
  TRE_TO = 'tre-to',

  // Justiça Militar Estadual — TJMs
  TJMMG = 'tjmmg',
  TJMRS = 'tjmrs',
  TJMSP = 'tjmsp',
}

/**
 * Array com todos os valores do enum para iteração.
 * @type {string[]}
 */
export const TRIBUNAIS_DATAJUD_VALUES: string[] = Object.values(TribunalDataJudEnum);

/**
 * Verifica se uma string é um tribunal DataJud válido.
 * @param {string} value - Valor a verificar
 * @returns {boolean}
 */
export function isTribunalDataJudEnum(value: string): value is TribunalDataJudEnum {
  return TRIBUNAIS_DATAJUD_VALUES.includes(value.toLowerCase());
}

/**
 * Parse seguro de string para TribunalDataJudEnum.
 * @param {string} value - String a parsear
 * @returns {TribunalDataJudEnum | null}
 */
export function parseTribunalDataJudEnum(value: string): TribunalDataJudEnum | null {
  const lower = value.toLowerCase();
  const found = TRIBUNAIS_DATAJUD_VALUES.find((v) => v === lower);
  return found ? (found as TribunalDataJudEnum) : null;
}

/**
 * Schema Zod nativo para TribunalDataJudEnum.
 * Usa z.nativeEnum() para validação type-safe.
 */
export const TribunalDataJudEnumSchema = z.nativeEnum(TribunalDataJudEnum);
