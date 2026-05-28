/**
 * @fileoverview DTO de BoaVistaAcertaMaisPositivoPF — DirectData.
 * @module infrastructure/providers/directdata/dtos/BoaVistaAcertaMaisPositivoPFDto
 */

import { z } from 'zod';

export const BoaVistaAcertaMaisPositivoPFRetornoSchema = z.object({
  acoesCiveis: z.record(z.unknown()),
  cartaoNacionalSaude: z.string().nullable().optional(),
  chequeSemFundoBacen: z.record(z.unknown()),
  chequeSemFundoVarejo: z.record(z.unknown()),
  classeSocial: z.string().nullable().optional(),
  controlePositivo: z.record(z.unknown()),
  cpf: z.string().nullable().optional(),
  cpfDataAtualizacaoReceita: z.string().nullable().optional(),
  cpfOrigem: z.string().nullable().optional(),
  cpfSituacao: z.string().nullable().optional(),
  decisao: z.record(z.unknown()),
  email: z.string().nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  estadoCivil: z.string().nullable().optional(),
  faixaRenda: z.string().nullable().optional(),
  falenciasAcoesRecuperacoes: z.record(z.unknown()),
  grauInstrucao: z.string().nullable().optional(),
  indicacaoObito: z.string().nullable().optional(),
  mae: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  nascimento: z.string().nullable().optional(),
  naturalidade: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomePai: z.string().nullable().optional(),
  nomeSocial: z.string().nullable().optional(),
  numeroDependentes: z.string().nullable().optional(),
  numeroPIS: z.string().nullable().optional(),
  participacaoEmEmpresas: z.record(z.unknown()),
  passagensComerciais: z.record(z.unknown()),
  pendenciasFinanceiras: z.record(z.unknown()),
  poderAquisitivo: z.string().nullable().optional(),
  protestos: z.record(z.unknown()),
  qtdDependentesBolsaFamilia: z.string().nullable().optional(),
  rendaPresumida: z.record(z.unknown()),
  restricoes: z.record(z.unknown()),
  rg: z.string().nullable().optional(),
  rgDataEmissao: z.string().nullable().optional(),
  rguf: z.string().nullable().optional(),
  scores: z.record(z.unknown()),
  sexo: z.string().nullable().optional(),
  telefones: z.array(z.record(z.unknown())).nullable().optional(),
  tituloEleitor: z.string().nullable().optional(),
  ultimoImpostoRenda: z.string().nullable().optional()
});

export type BoaVistaAcertaMaisPositivoPFRetornoDto = z.infer<typeof BoaVistaAcertaMaisPositivoPFRetornoSchema>;
