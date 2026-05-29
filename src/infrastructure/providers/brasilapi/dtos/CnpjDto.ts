import { z } from 'zod';

export const CnpjQsaSchema = z.object({
  nome: z.string().nullable(),
  qual: z.string().nullable(),
  pais_origem: z.string().nullable(),
  representante_legal: z.string().nullable(),
});

export const CnpjSchema = z.object({
  cnpj: z.string(),
  razao_social: z.string().nullable(),
  nome_fantasia: z.string().nullable(),
  natureza_juridica: z.string().nullable(),
  porte: z.string().nullable(),
  situacao_cadastral: z.string().nullable(),
  data_situacao_cadastral: z.string().nullable(),
  logradouro: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
  bairro: z.string().nullable(),
  cep: z.string().nullable(),
  municipio: z.string().nullable(),
  uf: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  cnae_fiscal: z.number().nullable(),
  cnae_fiscal_descricao: z.string().nullable(),
  capital_social: z.string().nullable(),
  qsa: z.array(CnpjQsaSchema).default([]),
  data_abertura: z.string().nullable(),
  data_opcao_simples: z.string().nullable(),
  data_exclusao_simples: z.string().nullable(),
});

export type CnpjDto = z.infer<typeof CnpjSchema>;
export type CnpjQsa = z.infer<typeof CnpjQsaSchema>;
