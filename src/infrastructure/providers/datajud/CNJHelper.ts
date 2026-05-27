/**
 * @fileoverview Helper para extrair informações de números CNJ.
 * Mapeia dígitos J.TR para siglas de tribunais no DataJud.
 * @module infrastructure/providers/datajud/CNJHelper
 */

const TJ_SIGLAS = [
  'tjac', 'tjal', 'tjam', 'tjap', 'tjba', 'tjce', 'tjdft', 'tjes',
  'tjgo', 'tjma', 'tjmg', 'tjms', 'tjmt', 'tjpa', 'tjpb', 'tjpe',
  'tjpi', 'tjpr', 'tjrj', 'tjrn', 'tjro', 'tjrr', 'tjrs', 'tjsc',
  'tjse', 'tjsp', 'tjto',
] as const;

const TRF_SIGLAS = [
  'trf1', 'trf2', 'trf3', 'trf4', 'trf5', 'trf6',
] as const;

const TRT_SIGLAS = Array.from({ length: 24 }, (_, i) => `trt${i + 1}`);

const TRE_SIGLAS = [
  'tre-ac', 'tre-al', 'tre-am', 'tre-ap', 'tre-ba', 'tre-ce', 'tre-dft',
  'tre-es', 'tre-go', 'tre-ma', 'tre-mg', 'tre-ms', 'tre-mt', 'tre-pa',
  'tre-pb', 'tre-pe', 'tre-pi', 'tre-pr', 'tre-rj', 'tre-rn', 'tre-ro',
  'tre-rr', 'tre-rs', 'tre-sc', 'tre-se', 'tre-sp', 'tre-to',
];

const TJM_SIGLAS = ['tjmmg', 'tjmrs', 'tjmsp'];

/**
 * Extrai sigla do tribunal DataJud a partir de um número CNJ.
 * Formato CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
 * - J = órgão do Judiciário (4=TRF, 5=TRT, 6=TRE, 7=TJM, 8=TJ)
 * - TR = código sequencial do tribunal
 *
 * @param {string} numeroCNJ - Número CNJ (com ou sem formatação)
 * @returns {string | null} Sigla do tribunal (ex: 'tjsp') ou null se inválido
 *
 * @example
 * extrairSiglaDoCNJ('1004634-81.2023.8.26.0045') // 'tjsp'
 * extrairSiglaDoCNJ('0931245-20.2025.8.12.0001')  // 'tjms'
 */
export function extrairSiglaDoCNJ(numeroCNJ: string): string | null {
  const digits = numeroCNJ.replace(/\D/g, '');

  // Validação básica: 20 dígitos para CNJ
  if (digits.length !== 20) return null;

  const j = digits.substring(13, 14); // posição 14 (índice 13)
  const tr = digits.substring(14, 16); // posições 15-16 (índices 14-15)
  const trNum = Number.parseInt(tr, 10);

  if (Number.isNaN(trNum) || trNum < 1) return null;

  switch (j) {
    case '8': { // Justiça Estadual (TJ)
      const idx = trNum - 1;
      if (idx >= 0 && idx < TJ_SIGLAS.length) return TJ_SIGLAS[idx] ?? null;
      return null;
    }
    case '4': { // Justiça Federal (TRF)
      const idx = trNum - 1;
      if (idx >= 0 && idx < TRF_SIGLAS.length) return TRF_SIGLAS[idx] ?? null;
      return null;
    }
    case '5': { // Justiça do Trabalho (TRT)
      const idx = trNum - 1;
      if (idx >= 0 && idx < TRT_SIGLAS.length) return TRT_SIGLAS[idx] ?? null;
      return null;
    }
    case '6': { // Justiça Eleitoral (TRE)
      const idx = trNum - 1;
      if (idx >= 0 && idx < TRE_SIGLAS.length) return TRE_SIGLAS[idx] ?? null;
      return null;
    }
    case '7': { // Justiça Militar (TJM)
      const idx = trNum - 1;
      if (idx >= 0 && idx < TJM_SIGLAS.length) return TJM_SIGLAS[idx] ?? null;
      return null;
    }
    default:
      return null;
  }
}

/**
 * Remove formatação de um número CNJ, deixando apenas os dígitos.
 *
 * @param {string} numeroCNJ - Número CNJ formatado ou não
 * @returns {string} Dígitos do CNJ
 */
export function limparCNJ(numeroCNJ: string): string {
  return numeroCNJ.replace(/\D/g, '');
}

/**
 * Verifica se uma string parece ser um número CNJ válido (20 dígitos).
 *
 * @param {string} numero - String a verificar
 * @returns {boolean} true se parece CNJ
 */
export function pareceCNJ(numero: string): boolean {
  return /^\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}$/.test(numero);
}
