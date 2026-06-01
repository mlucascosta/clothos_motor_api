/**
 * @fileoverview DTO de BoaVistaRiscoPositivoPJ — DirectData.
 * @module infrastructure/providers/directdata/dtos/BoaVistaRiscoPositivoPJDto
 */

import { z } from 'zod';

export const BoaVistaRiscoPositivoPJRetornoSchema = z.object({
  alertas: z.array(z.record(z.unknown())).nullable().optional(),
  capitalSocial: z.string().nullable().optional(),
  cidadesFiliais: z.string().nullable().optional(),
  cnaePrimario: z.string().nullable().optional(),
  cnaeSecundario: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataConsultaSintegra: z.string().nullable().optional(),
  dataEncerramento: z.string().nullable().optional(),
  dataFundacao: z.string().nullable().optional(),
  dataSituacao: z.string().nullable().optional(),
  dataSituacaoSintegra: z.string().nullable().optional(),
  decisoes: z.record(z.unknown()),
  email: z.string().nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  faixaFuncionarios: z.string().nullable().optional(),
  governancas: z.record(z.unknown()),
  historicoConsulta: z.record(z.unknown()),
  indicadores: z.record(z.unknown()),
  inscricaoEstadual: z.string().nullable().optional(),
  inscricaoEstadualUf: z.string().nullable().optional(),
  naturezaJuridica: z.string().nullable().optional(),
  nire: z.string().nullable().optional(),
  nireUf: z.string().nullable().optional(),
  nomeFantasia: z.string().nullable().optional(),
  opcaoTributaria: z.string().nullable().optional(),
  porte: z.string().nullable().optional(),
  quantidadeFiliais: z.string().nullable().optional(),
  ramoAtividadePrimario: z.string().nullable().optional(),
  ramoAtividadeSecundario: z.string().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
  razaoSocialAnterior: z.string().nullable().optional(),
  restricoes: z.record(z.unknown()),
  score: z.record(z.unknown()),
  situacao: z.string().nullable().optional(),
  situacaoSintegra: z.string().nullable().optional(),
  telefones: z.array(z.record(z.unknown())).nullable().optional(),
  tipoSociedade: z.string().nullable().optional(),
});

export type BoaVistaRiscoPositivoPJRetornoDto = z.infer<
  typeof BoaVistaRiscoPositivoPJRetornoSchema
>;
