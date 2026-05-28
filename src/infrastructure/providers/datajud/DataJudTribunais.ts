/**
 * @fileoverview Mapeamento de tribunais da API Pública DataJud (CNJ).
 * Contém todas as 91 unidades jurisdicionais com sigla, nome e endpoint.
 * @module infrastructure/providers/datajud/DataJudTribunais
 */

/**
 * Representa um tribunal mapeado no DataJud.
 * @interface TribunalDataJud
 */
export interface TribunalDataJud {
  /** Sigla do tribunal (ex: 'tjsp', 'tst') */
  sigla: string;
  /** Nome completo do tribunal */
  nome: string;
  /** Endpoint completo da API para este tribunal */
  endpoint: string;
}

const BASE = 'https://api-publica.datajud.cnj.jus.br';

/**
 * Lista completa de tribunais disponíveis na API Pública DataJud.
 * @type {TribunalDataJud[]}
 */
export const DATAJUD_TRIBUNAIS: TribunalDataJud[] = [
  // Tribunais Superiores
  {
    sigla: 'tst',
    nome: 'Tribunal Superior do Trabalho',
    endpoint: `${BASE}/api_publica_tst/_search`,
  },
  {
    sigla: 'tse',
    nome: 'Tribunal Superior Eleitoral',
    endpoint: `${BASE}/api_publica_tse/_search`,
  },
  {
    sigla: 'stj',
    nome: 'Tribunal Superior de Justiça',
    endpoint: `${BASE}/api_publica_stj/_search`,
  },
  { sigla: 'stm', nome: 'Tribunal Superior Militar', endpoint: `${BASE}/api_publica_stm/_search` },

  // Justiça Federal — TRFs
  {
    sigla: 'trf1',
    nome: 'Tribunal Regional Federal da 1ª Região',
    endpoint: `${BASE}/api_publica_trf1/_search`,
  },
  {
    sigla: 'trf2',
    nome: 'Tribunal Regional Federal da 2ª Região',
    endpoint: `${BASE}/api_publica_trf2/_search`,
  },
  {
    sigla: 'trf3',
    nome: 'Tribunal Regional Federal da 3ª Região',
    endpoint: `${BASE}/api_publica_trf3/_search`,
  },
  {
    sigla: 'trf4',
    nome: 'Tribunal Regional Federal da 4ª Região',
    endpoint: `${BASE}/api_publica_trf4/_search`,
  },
  {
    sigla: 'trf5',
    nome: 'Tribunal Regional Federal da 5ª Região',
    endpoint: `${BASE}/api_publica_trf5/_search`,
  },
  {
    sigla: 'trf6',
    nome: 'Tribunal Regional Federal da 6ª Região',
    endpoint: `${BASE}/api_publica_trf6/_search`,
  },

  // Justiça Estadual — TJs
  {
    sigla: 'tjac',
    nome: 'Tribunal de Justiça do Acre',
    endpoint: `${BASE}/api_publica_tjac/_search`,
  },
  {
    sigla: 'tjal',
    nome: 'Tribunal de Justiça de Alagoas',
    endpoint: `${BASE}/api_publica_tjal/_search`,
  },
  {
    sigla: 'tjam',
    nome: 'Tribunal de Justiça do Amazonas',
    endpoint: `${BASE}/api_publica_tjam/_search`,
  },
  {
    sigla: 'tjap',
    nome: 'Tribunal de Justiça do Amapá',
    endpoint: `${BASE}/api_publica_tjap/_search`,
  },
  {
    sigla: 'tjba',
    nome: 'Tribunal de Justiça da Bahia',
    endpoint: `${BASE}/api_publica_tjba/_search`,
  },
  {
    sigla: 'tjce',
    nome: 'Tribunal de Justiça do Ceará',
    endpoint: `${BASE}/api_publica_tjce/_search`,
  },
  {
    sigla: 'tjdft',
    nome: 'TJ do Distrito Federal e Territórios',
    endpoint: `${BASE}/api_publica_tjdft/_search`,
  },
  {
    sigla: 'tjes',
    nome: 'Tribunal de Justiça do Espírito Santo',
    endpoint: `${BASE}/api_publica_tjes/_search`,
  },
  {
    sigla: 'tjgo',
    nome: 'Tribunal de Justiça de Goiás',
    endpoint: `${BASE}/api_publica_tjgo/_search`,
  },
  {
    sigla: 'tjma',
    nome: 'Tribunal de Justiça do Maranhão',
    endpoint: `${BASE}/api_publica_tjma/_search`,
  },
  {
    sigla: 'tjmg',
    nome: 'Tribunal de Justiça de Minas Gerais',
    endpoint: `${BASE}/api_publica_tjmg/_search`,
  },
  { sigla: 'tjms', nome: 'TJ do Mato Grosso do Sul', endpoint: `${BASE}/api_publica_tjms/_search` },
  {
    sigla: 'tjmt',
    nome: 'Tribunal de Justiça do Mato Grosso',
    endpoint: `${BASE}/api_publica_tjmt/_search`,
  },
  {
    sigla: 'tjpa',
    nome: 'Tribunal de Justiça do Pará',
    endpoint: `${BASE}/api_publica_tjpa/_search`,
  },
  {
    sigla: 'tjpb',
    nome: 'Tribunal de Justiça da Paraíba',
    endpoint: `${BASE}/api_publica_tjpb/_search`,
  },
  {
    sigla: 'tjpe',
    nome: 'Tribunal de Justiça de Pernambuco',
    endpoint: `${BASE}/api_publica_tjpe/_search`,
  },
  {
    sigla: 'tjpi',
    nome: 'Tribunal de Justiça do Piauí',
    endpoint: `${BASE}/api_publica_tjpi/_search`,
  },
  {
    sigla: 'tjpr',
    nome: 'Tribunal de Justiça do Paraná',
    endpoint: `${BASE}/api_publica_tjpr/_search`,
  },
  {
    sigla: 'tjrj',
    nome: 'Tribunal de Justiça do Rio de Janeiro',
    endpoint: `${BASE}/api_publica_tjrj/_search`,
  },
  {
    sigla: 'tjrn',
    nome: 'TJ do Rio Grande do Norte',
    endpoint: `${BASE}/api_publica_tjrn/_search`,
  },
  {
    sigla: 'tjro',
    nome: 'Tribunal de Justiça de Rondônia',
    endpoint: `${BASE}/api_publica_tjro/_search`,
  },
  {
    sigla: 'tjrr',
    nome: 'Tribunal de Justiça de Roraima',
    endpoint: `${BASE}/api_publica_tjrr/_search`,
  },
  {
    sigla: 'tjrs',
    nome: 'Tribunal de Justiça do Rio Grande do Sul',
    endpoint: `${BASE}/api_publica_tjrs/_search`,
  },
  {
    sigla: 'tjsc',
    nome: 'Tribunal de Justiça de Santa Catarina',
    endpoint: `${BASE}/api_publica_tjsc/_search`,
  },
  {
    sigla: 'tjse',
    nome: 'Tribunal de Justiça de Sergipe',
    endpoint: `${BASE}/api_publica_tjse/_search`,
  },
  {
    sigla: 'tjsp',
    nome: 'Tribunal de Justiça de São Paulo',
    endpoint: `${BASE}/api_publica_tjsp/_search`,
  },
  {
    sigla: 'tjto',
    nome: 'Tribunal de Justiça do Tocantins',
    endpoint: `${BASE}/api_publica_tjto/_search`,
  },

  // Justiça do Trabalho — TRTs
  {
    sigla: 'trt1',
    nome: 'Tribunal Regional do Trabalho da 1ª Região',
    endpoint: `${BASE}/api_publica_trt1/_search`,
  },
  {
    sigla: 'trt2',
    nome: 'Tribunal Regional do Trabalho da 2ª Região',
    endpoint: `${BASE}/api_publica_trt2/_search`,
  },
  {
    sigla: 'trt3',
    nome: 'Tribunal Regional do Trabalho da 3ª Região',
    endpoint: `${BASE}/api_publica_trt3/_search`,
  },
  {
    sigla: 'trt4',
    nome: 'Tribunal Regional do Trabalho da 4ª Região',
    endpoint: `${BASE}/api_publica_trt4/_search`,
  },
  {
    sigla: 'trt5',
    nome: 'Tribunal Regional do Trabalho da 5ª Região',
    endpoint: `${BASE}/api_publica_trt5/_search`,
  },
  {
    sigla: 'trt6',
    nome: 'Tribunal Regional do Trabalho da 6ª Região',
    endpoint: `${BASE}/api_publica_trt6/_search`,
  },
  {
    sigla: 'trt7',
    nome: 'Tribunal Regional do Trabalho da 7ª Região',
    endpoint: `${BASE}/api_publica_trt7/_search`,
  },
  {
    sigla: 'trt8',
    nome: 'Tribunal Regional do Trabalho da 8ª Região',
    endpoint: `${BASE}/api_publica_trt8/_search`,
  },
  {
    sigla: 'trt9',
    nome: 'Tribunal Regional do Trabalho da 9ª Região',
    endpoint: `${BASE}/api_publica_trt9/_search`,
  },
  {
    sigla: 'trt10',
    nome: 'Tribunal Regional do Trabalho da 10ª Região',
    endpoint: `${BASE}/api_publica_trt10/_search`,
  },
  {
    sigla: 'trt11',
    nome: 'Tribunal Regional do Trabalho da 11ª Região',
    endpoint: `${BASE}/api_publica_trt11/_search`,
  },
  {
    sigla: 'trt12',
    nome: 'Tribunal Regional do Trabalho da 12ª Região',
    endpoint: `${BASE}/api_publica_trt12/_search`,
  },
  {
    sigla: 'trt13',
    nome: 'Tribunal Regional do Trabalho da 13ª Região',
    endpoint: `${BASE}/api_publica_trt13/_search`,
  },
  {
    sigla: 'trt14',
    nome: 'Tribunal Regional do Trabalho da 14ª Região',
    endpoint: `${BASE}/api_publica_trt14/_search`,
  },
  {
    sigla: 'trt15',
    nome: 'Tribunal Regional do Trabalho da 15ª Região',
    endpoint: `${BASE}/api_publica_trt15/_search`,
  },
  {
    sigla: 'trt16',
    nome: 'Tribunal Regional do Trabalho da 16ª Região',
    endpoint: `${BASE}/api_publica_trt16/_search`,
  },
  {
    sigla: 'trt17',
    nome: 'Tribunal Regional do Trabalho da 17ª Região',
    endpoint: `${BASE}/api_publica_trt17/_search`,
  },
  {
    sigla: 'trt18',
    nome: 'Tribunal Regional do Trabalho da 18ª Região',
    endpoint: `${BASE}/api_publica_trt18/_search`,
  },
  {
    sigla: 'trt19',
    nome: 'Tribunal Regional do Trabalho da 19ª Região',
    endpoint: `${BASE}/api_publica_trt19/_search`,
  },
  {
    sigla: 'trt20',
    nome: 'Tribunal Regional do Trabalho da 20ª Região',
    endpoint: `${BASE}/api_publica_trt20/_search`,
  },
  {
    sigla: 'trt21',
    nome: 'Tribunal Regional do Trabalho da 21ª Região',
    endpoint: `${BASE}/api_publica_trt21/_search`,
  },
  {
    sigla: 'trt22',
    nome: 'Tribunal Regional do Trabalho da 22ª Região',
    endpoint: `${BASE}/api_publica_trt22/_search`,
  },
  {
    sigla: 'trt23',
    nome: 'Tribunal Regional do Trabalho da 23ª Região',
    endpoint: `${BASE}/api_publica_trt23/_search`,
  },
  {
    sigla: 'trt24',
    nome: 'Tribunal Regional do Trabalho da 24ª Região',
    endpoint: `${BASE}/api_publica_trt24/_search`,
  },

  // Justiça Eleitoral — TREs
  {
    sigla: 'tre-ac',
    nome: 'Tribunal Regional Eleitoral do Acre',
    endpoint: `${BASE}/api_publica_tre-ac/_search`,
  },
  {
    sigla: 'tre-al',
    nome: 'Tribunal Regional Eleitoral de Alagoas',
    endpoint: `${BASE}/api_publica_tre-al/_search`,
  },
  {
    sigla: 'tre-am',
    nome: 'Tribunal Regional Eleitoral do Amazonas',
    endpoint: `${BASE}/api_publica_tre-am/_search`,
  },
  {
    sigla: 'tre-ap',
    nome: 'Tribunal Regional Eleitoral do Amapá',
    endpoint: `${BASE}/api_publica_tre-ap/_search`,
  },
  {
    sigla: 'tre-ba',
    nome: 'Tribunal Regional Eleitoral da Bahia',
    endpoint: `${BASE}/api_publica_tre-ba/_search`,
  },
  {
    sigla: 'tre-ce',
    nome: 'Tribunal Regional Eleitoral do Ceará',
    endpoint: `${BASE}/api_publica_tre-ce/_search`,
  },
  {
    sigla: 'tre-dft',
    nome: 'Tribunal Regional Eleitoral do Distrito Federal',
    endpoint: `${BASE}/api_publica_tre-dft/_search`,
  },
  {
    sigla: 'tre-es',
    nome: 'Tribunal Regional Eleitoral do Espírito Santo',
    endpoint: `${BASE}/api_publica_tre-es/_search`,
  },
  {
    sigla: 'tre-go',
    nome: 'Tribunal Regional Eleitoral de Goiás',
    endpoint: `${BASE}/api_publica_tre-go/_search`,
  },
  {
    sigla: 'tre-ma',
    nome: 'Tribunal Regional Eleitoral do Maranhão',
    endpoint: `${BASE}/api_publica_tre-ma/_search`,
  },
  {
    sigla: 'tre-mg',
    nome: 'Tribunal Regional Eleitoral de Minas Gerais',
    endpoint: `${BASE}/api_publica_tre-mg/_search`,
  },
  {
    sigla: 'tre-ms',
    nome: 'Tribunal Regional Eleitoral do Mato Grosso do Sul',
    endpoint: `${BASE}/api_publica_tre-ms/_search`,
  },
  {
    sigla: 'tre-mt',
    nome: 'Tribunal Regional Eleitoral do Mato Grosso',
    endpoint: `${BASE}/api_publica_tre-mt/_search`,
  },
  {
    sigla: 'tre-pa',
    nome: 'Tribunal Regional Eleitoral do Pará',
    endpoint: `${BASE}/api_publica_tre-pa/_search`,
  },
  {
    sigla: 'tre-pb',
    nome: 'Tribunal Regional Eleitoral da Paraíba',
    endpoint: `${BASE}/api_publica_tre-pb/_search`,
  },
  {
    sigla: 'tre-pe',
    nome: 'Tribunal Regional Eleitoral de Pernambuco',
    endpoint: `${BASE}/api_publica_tre-pe/_search`,
  },
  {
    sigla: 'tre-pi',
    nome: 'Tribunal Regional Eleitoral do Piauí',
    endpoint: `${BASE}/api_publica_tre-pi/_search`,
  },
  {
    sigla: 'tre-pr',
    nome: 'Tribunal Regional Eleitoral do Paraná',
    endpoint: `${BASE}/api_publica_tre-pr/_search`,
  },
  {
    sigla: 'tre-rj',
    nome: 'Tribunal Regional Eleitoral do Rio de Janeiro',
    endpoint: `${BASE}/api_publica_tre-rj/_search`,
  },
  {
    sigla: 'tre-rn',
    nome: 'Tribunal Regional Eleitoral do Rio Grande do Norte',
    endpoint: `${BASE}/api_publica_tre-rn/_search`,
  },
  {
    sigla: 'tre-ro',
    nome: 'Tribunal Regional Eleitoral de Rondônia',
    endpoint: `${BASE}/api_publica_tre-ro/_search`,
  },
  {
    sigla: 'tre-rr',
    nome: 'Tribunal Regional Eleitoral de Roraima',
    endpoint: `${BASE}/api_publica_tre-rr/_search`,
  },
  {
    sigla: 'tre-rs',
    nome: 'Tribunal Regional Eleitoral do Rio Grande do Sul',
    endpoint: `${BASE}/api_publica_tre-rs/_search`,
  },
  {
    sigla: 'tre-sc',
    nome: 'Tribunal Regional Eleitoral de Santa Catarina',
    endpoint: `${BASE}/api_publica_tre-sc/_search`,
  },
  {
    sigla: 'tre-se',
    nome: 'Tribunal Regional Eleitoral de Sergipe',
    endpoint: `${BASE}/api_publica_tre-se/_search`,
  },
  {
    sigla: 'tre-sp',
    nome: 'Tribunal Regional Eleitoral de São Paulo',
    endpoint: `${BASE}/api_publica_tre-sp/_search`,
  },
  {
    sigla: 'tre-to',
    nome: 'Tribunal Regional Eleitoral do Tocantins',
    endpoint: `${BASE}/api_publica_tre-to/_search`,
  },

  // Justiça Militar Estadual — TJMs
  {
    sigla: 'tjmmg',
    nome: 'Tribunal de Justiça Militar de Minas Gerais',
    endpoint: `${BASE}/api_publica_tjmmg/_search`,
  },
  {
    sigla: 'tjmrs',
    nome: 'Tribunal de Justiça Militar do Rio Grande do Sul',
    endpoint: `${BASE}/api_publica_tjmrs/_search`,
  },
  {
    sigla: 'tjmsp',
    nome: 'Tribunal de Justiça Militar de São Paulo',
    endpoint: `${BASE}/api_publica_tjmsp/_search`,
  },
];

/**
 * Mapa de siglas para endpoints para lookup O(1).
 * @type {Readonly<Record<string, string>>}
 */
export const DATAJUD_TRIBUNAIS_MAP: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(DATAJUD_TRIBUNAIS.map((t) => [t.sigla, t.endpoint])),
);

/**
 * Retorna o endpoint de um tribunal pelo slug/sigla.
 *
 * @param {string} sigla - Sigla do tribunal (ex: 'tjsp')
 * @returns {string | undefined} Endpoint completo ou undefined se não encontrado
 */
export function getDataJudEndpoint(sigla: string): string | undefined {
  return DATAJUD_TRIBUNAIS_MAP[sigla.toLowerCase()];
}

/**
 * Retorna o path relativo do tribunal para uso com IHttpClient.
 * Equivalente a `getDataJudEndpoint(sigla)` sem o prefixo da base URL.
 *
 * @param {string} sigla - Sigla do tribunal (ex: 'tjsp')
 * @returns {string | null} Path relativo (ex: '/api_publica_tjsp/_search') ou null se não encontrado
 */
export function getDataJudPath(sigla: string): string | null {
  const endpoint = getDataJudEndpoint(sigla);
  if (!endpoint) return null;
  return endpoint.slice(BASE.length);
}

/**
 * Verifica se uma sigla é um tribunal válido no DataJud.
 *
 * @param {string} sigla - Sigla a verificar
 * @returns {boolean} true se válido
 */
export function isValidTribunal(sigla: string): boolean {
  return sigla.toLowerCase() in DATAJUD_TRIBUNAIS_MAP;
}
