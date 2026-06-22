import { z } from 'zod';

/**
 * Schema do quadro societário (QSA) retornado pela BrasilAPI v1.
 * Campos podem variar entre sócios PF/PJ — modelados como nullish para resiliência.
 * Chaves desconhecidas são ignoradas (Zod object não-strict) para compatibilidade futura.
 */
export const CnpjQsaSchema = z.object({
  nome_socio: z.string().nullish(),
  cnpj_cpf_do_socio: z.string().nullish(),
  qualificacao_socio: z.string().nullish(),
  codigo_qualificacao_socio: z.number().nullish(),
  data_entrada_sociedade: z.string().nullish(),
  identificador_de_socio: z.number().nullish(),
  faixa_etaria: z.string().nullish(),
  codigo_faixa_etaria: z.number().nullish(),
  pais: z.string().nullish(),
  codigo_pais: z.number().nullish(),
  nome_representante_legal: z.string().nullish(),
  cpf_representante_legal: z.string().nullish(),
  qualificacao_representante_legal: z.string().nullish(),
  codigo_qualificacao_representante_legal: z.number().nullish(),
});

/** CNAE secundário ({ codigo, descricao }). */
export const CnpjCnaeSecundarioSchema = z.object({
  codigo: z.number().nullish(),
  descricao: z.string().nullish(),
});

/**
 * Schema de dados cadastrais de CNPJ da BrasilAPI (`/cnpj/v1/{cnpj}`).
 *
 * Modelado contra a resposta real da API (fixture
 * `tests/fixtures/brasilapi/cnpj-00000000000191.json`). Pontos sensíveis que
 * causaram drift no schema anterior:
 * - `situacao_cadastral`, `capital_social`, `codigo_porte` são **números**.
 * - telefone é `ddd_telefone_1`/`ddd_telefone_2` (não `telefone`).
 * - datas são `data_inicio_atividade`, `data_opcao_pelo_simples`, etc.
 * - `qsa` usa `nome_socio`/`qualificacao_socio`/... (ver {@link CnpjQsaSchema}).
 *
 * Campos `nullish()` toleram CNPJs que omitem/anulam valores; chaves extras são
 * ignoradas para resiliência a mudanças aditivas da BrasilAPI.
 */
export const CnpjSchema = z.object({
  cnpj: z.string(),
  razao_social: z.string().nullish(),
  nome_fantasia: z.string().nullish(),

  // Situação cadastral
  situacao_cadastral: z.number().nullish(),
  descricao_situacao_cadastral: z.string().nullish(),
  data_situacao_cadastral: z.string().nullish(),
  motivo_situacao_cadastral: z.number().nullish(),
  descricao_motivo_situacao_cadastral: z.string().nullish(),
  situacao_especial: z.string().nullish(),
  data_situacao_especial: z.string().nullish(),

  // Natureza e porte
  codigo_natureza_juridica: z.number().nullish(),
  natureza_juridica: z.string().nullish(),
  codigo_porte: z.number().nullish(),
  porte: z.string().nullish(),
  capital_social: z.number().nullish(),

  // Matriz/filial
  identificador_matriz_filial: z.number().nullish(),
  descricao_identificador_matriz_filial: z.string().nullish(),

  // Endereço
  descricao_tipo_de_logradouro: z.string().nullish(),
  logradouro: z.string().nullish(),
  numero: z.string().nullish(),
  complemento: z.string().nullish(),
  bairro: z.string().nullish(),
  cep: z.string().nullish(),
  uf: z.string().nullish(),
  municipio: z.string().nullish(),
  codigo_municipio: z.number().nullish(),
  codigo_municipio_ibge: z.number().nullish(),
  nome_cidade_no_exterior: z.string().nullish(),
  codigo_pais: z.number().nullish(),
  pais: z.string().nullish(),

  // Contato
  ddd_telefone_1: z.string().nullish(),
  ddd_telefone_2: z.string().nullish(),
  ddd_fax: z.string().nullish(),
  email: z.string().nullish(),

  // Atividade econômica
  cnae_fiscal: z.number().nullish(),
  cnae_fiscal_descricao: z.string().nullish(),
  cnaes_secundarios: z.array(CnpjCnaeSecundarioSchema).default([]),
  data_inicio_atividade: z.string().nullish(),

  // Simples / MEI
  opcao_pelo_simples: z.boolean().nullish(),
  data_opcao_pelo_simples: z.string().nullish(),
  data_exclusao_do_simples: z.string().nullish(),
  opcao_pelo_mei: z.boolean().nullish(),
  data_opcao_pelo_mei: z.string().nullish(),
  data_exclusao_do_mei: z.string().nullish(),

  // Responsável e regime
  qualificacao_do_responsavel: z.number().nullish(),
  ente_federativo_responsavel: z.string().nullish(),
  regime_tributario: z.array(z.unknown()).default([]),

  // Quadro societário
  qsa: z.array(CnpjQsaSchema).default([]),
});

export type CnpjDto = z.infer<typeof CnpjSchema>;
export type CnpjQsa = z.infer<typeof CnpjQsaSchema>;
export type CnpjCnaeSecundario = z.infer<typeof CnpjCnaeSecundarioSchema>;
