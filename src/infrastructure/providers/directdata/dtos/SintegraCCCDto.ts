/**
 * @fileoverview DTO de SintegraCCC — DirectData.
 * @module infrastructure/providers/directdata/dtos/SintegraCCCDto
 */

import { z } from 'zod';

export const SintegraCCCRetornoSchema = z.object({
  atividadeEconomicaPrincipal: z.string().nullable().optional(),
  atividadesEconomicasSecundarias: z.array(z.record(z.unknown())).nullable().optional(),
  bairro: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  codigoControle: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataAbertura: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataCredenciamentoEmissorNFe: z.string().nullable().optional(),
  dataFimAtividade: z.string().nullable().optional(),
  dataInicioAtividade: z.string().nullable().optional(),
  dataInicioObrigatoriedadeNFe: z.string().nullable().optional(),
  dataSituacaoCadastral: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  ie: z.string().nullable().optional(),
  indicadorObrigatoriedadeNFe: z.string().nullable().optional(),
  informacaoIBGE: z.record(z.unknown()),
  inscricoesEstaduais: z.array(z.record(z.unknown())).nullable().optional(),
  logradouro: z.string().nullable().optional(),
  motivoSituacaoCadastral: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  naturezaJuridica: z.string().nullable().optional(),
  nomeEmpresarial: z.string().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  numero: z.number().int().nullable().optional(),
  observacao: z.string().nullable().optional(),
  ocorrenciaFiscal: z.string().nullable().optional(),
  regimeApuracao: z.string().nullable().optional(),
  situacaoCadastral: z.string().nullable().optional(),
  situacaoContribuinteNaData: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  tipoIE: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  ufie: z.string().nullable().optional(),
});

export type SintegraCCCRetornoDto = z.infer<typeof SintegraCCCRetornoSchema>;
