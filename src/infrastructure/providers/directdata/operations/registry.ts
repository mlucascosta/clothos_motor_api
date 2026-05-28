/**
 * @fileoverview Registry/factory de todas as operations do DirectData.
 * @module infrastructure/providers/directdata/operations/registry
 */

import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IDirectDataOperation } from '../ports/IDirectDataOperation.js';

import { AML } from './AML.js';
import { ANTTConsultaRegularidadeTransportadora } from './ANTTConsultaRegularidadeTransportadora.js';
import { APFRural } from './APFRural.js';
import { AcordosLeniencia } from './AcordosLeniencia.js';
import { AnbimaCertificadoEDU } from './AnbimaCertificadoEDU.js';
import { AntifraudePix } from './AntifraudePix.js';
import { AuxilioEmergencial } from './AuxilioEmergencial.js';
import { AuxilioReconstrucao } from './AuxilioReconstrucao.js';
import { BancoCentralInabilitados } from './BancoCentralInabilitados.js';
import { BancoCentralProibidos } from './BancoCentralProibidos.js';
import { BeneficiarioFinal } from './BeneficiarioFinal.js';
import { BeneficioPrestacaoContinuada } from './BeneficioPrestacaoContinuada.js';
import { BeneficiosSociais } from './BeneficiosSociais.js';
import { BetSafeCompliance } from './BetSafeCompliance.js';
import { BoaVistaAcertaCompletoPositivoPF } from './BoaVistaAcertaCompletoPositivoPF.js';
import { BoaVistaAcertaMaisPositivoPF } from './BoaVistaAcertaMaisPositivoPF.js';
import { BoaVistaDefineLimitePositivoPJ } from './BoaVistaDefineLimitePositivoPJ.js';
import { BoaVistaRiscoPositivoPJ } from './BoaVistaRiscoPositivoPJ.js';
import { BolsaFamilia } from './BolsaFamilia.js';
import { CADINSecretariaFazendaEstaduais } from './CADINSecretariaFazendaEstaduais.js';
import { CADINSecretariaFazendaSP } from './CADINSecretariaFazendaSP.js';
import { CAFCadastroNacionalAgriculturaPF } from './CAFCadastroNacionalAgriculturaPF.js';
import { CAFCadastroNacionalAgriculturaPJ } from './CAFCadastroNacionalAgriculturaPJ.js';
import { CARFConselhoAdministrativodeRecursosFiscais } from './CARFConselhoAdministrativodeRecursosFiscais.js';
import { CGUConsultoriaGeralUniao } from './CGUConsultoriaGeralUniao.js';
import { CNJMandadosPrisao } from './CNJMandadosPrisao.js';
import { CONFEA } from './CONFEA.js';
import { CVMComissaodeValoresMobiliarios } from './CVMComissaodeValoresMobiliarios.js';
import { CVMProcessosAdministrativosSancionadores } from './CVMProcessosAdministrativosSancionadores.js';
import { CadastroAmbientalRural } from './CadastroAmbientalRural.js';
import { CadastroEmpresasInidoneasSuspensas } from './CadastroEmpresasInidoneasSuspensas.js';
import { CadastroEntidadesPrivadasImpedidas } from './CadastroEntidadesPrivadasImpedidas.js';
import { CadastroExpulsoesAdministracaoFederal } from './CadastroExpulsoesAdministracaoFederal.js';
import { CadastroImoveisRurais } from './CadastroImoveisRurais.js';
import { CadastroNacionalEmpresasPunidas } from './CadastroNacionalEmpresasPunidas.js';
import { CadastroNacionalImprobidadeAdministrativa } from './CadastroNacionalImprobidadeAdministrativa.js';
import { CadastroPessoaFisica } from './CadastroPessoaFisica.js';
import { CadastroPessoaFisicaPlus } from './CadastroPessoaFisicaPlus.js';
import { CadastroPessoaJuridica } from './CadastroPessoaJuridica.js';
import { CadastroPessoaJuridicaPlus } from './CadastroPessoaJuridicaPlus.js';
import { CadastroReceitaPessoaFisica } from './CadastroReceitaPessoaFisica.js';
import { CaixaRegularidadeEmpregadorFGTS } from './CaixaRegularidadeEmpregadorFGTS.js';
import { CarteiraNacionalHabilitacao } from './CarteiraNacionalHabilitacao.js';
import { CertidaoConjuntaDebitosPessoaFisica } from './CertidaoConjuntaDebitosPessoaFisica.js';
import { CertidaoConjuntaDebitosPessoaJuridica } from './CertidaoConjuntaDebitosPessoaJuridica.js';
import { CertidaoNegativaDebitos } from './CertidaoNegativaDebitos.js';
import { CertidaoNegativaDebitosImovelRural } from './CertidaoNegativaDebitosImovelRural.js';
import { CertidaoNegativaDebitosMunicipal } from './CertidaoNegativaDebitosMunicipal.js';
import { ConsultaVeicular } from './ConsultaVeicular.js';
import { ConsultaVeicularFipe } from './ConsultaVeicularFipe.js';
import { ConsultaVeicularFrotas } from './ConsultaVeicularFrotas.js';
import { CorreiosBuscaCEP } from './CorreiosBuscaCEP.js';
import { DAPPessoaFisica } from './DAPPessoaFisica.js';
import { DAPPessoaJuridica } from './DAPPessoaJuridica.js';
import { DetalhamentoNegativo } from './DetalhamentoNegativo.js';
import { DossieCreditoCompleto } from './DossieCreditoCompleto.js';
import { EUFinancialList } from './EUFinancialList.js';
import { EnriquecimentoLead } from './EnriquecimentoLead.js';
import { FBIMostWanted } from './FBIMostWanted.js';
import { FinCEN } from './FinCEN.js';
import { GarantiaSafra } from './GarantiaSafra.js';
import { Historico } from './Historico.js';
import { HistoricoObterRetornoConsultaAsync } from './HistoricoObterRetornoConsultaAsync.js';
import { HistoricoVeiculos } from './HistoricoVeiculos.js';
import { IBAMACertidaoNegativaDebitos } from './IBAMACertidaoNegativaDebitos.js';
import { IBAMACertidaoNegativaEmbargos } from './IBAMACertidaoNegativaEmbargos.js';
import { IBAMACertificadoRegularidade } from './IBAMACertificadoRegularidade.js';
import { IBAMAConsultaAutuacoesAmbientais } from './IBAMAConsultaAutuacoesAmbientais.js';
import { Interpol } from './Interpol.js';
import { MPFCertidaoNegativa } from './MPFCertidaoNegativa.js';
import { MPMTMinisterioPublicoMatoGrosso } from './MPMTMinisterioPublicoMatoGrosso.js';
import { MTEInfracoesTrabalhistas } from './MTEInfracoesTrabalhistas.js';
import { MinisterioPublicoTrabalho } from './MinisterioPublicoTrabalho.js';
import { MinisterioTrabalhoPIS } from './MinisterioTrabalhoPIS.js';
import { NivelSocioeconomico } from './NivelSocioeconomico.js';
import { NivelSocioeconomicoCrypt } from './NivelSocioeconomicoCrypt.js';
import { NotaFiscalEletronicaCompleta } from './NotaFiscalEletronicaCompleta.js';
import { NotaFiscalEletronicaInutilizacao } from './NotaFiscalEletronicaInutilizacao.js';
import { OFAC } from './OFAC.js';
import { Obito } from './Obito.js';
import { PEPParentescos } from './PEPParentescos.js';
import { PETITrabalhoInfantil } from './PETITrabalhoInfantil.js';
import { PGFNListaDevedoresUniao } from './PGFNListaDevedoresUniao.js';
import { PRFInfracoes } from './PRFInfracoes.js';
import { PessoaExpostaPoliticamente } from './PessoaExpostaPoliticamente.js';
import { PoliciaCivilAntecedentesCriminais } from './PoliciaCivilAntecedentesCriminais.js';
import { PoliciaFederalAntecedentesCriminais } from './PoliciaFederalAntecedentesCriminais.js';
import { ProcessosJudiciaisAgrupada } from './ProcessosJudiciaisAgrupada.js';
import { ProcessosJudiciaisCompleta } from './ProcessosJudiciaisCompleta.js';
import { ProcessosJudiciaisSimplificada } from './ProcessosJudiciaisSimplificada.js';
import { ProtestosOnline } from './ProtestosOnline.js';
import { ProtestosSP } from './ProtestosSP.js';
import { ReceitaFederalPessoaFisica } from './ReceitaFederalPessoaFisica.js';
import { ReceitaFederalPessoaJuridica } from './ReceitaFederalPessoaJuridica.js';
import { ReceitaPJParticipacaoSocietaria } from './ReceitaPJParticipacaoSocietaria.js';
import { RegistrationDataArgentina } from './RegistrationDataArgentina.js';
import { RegistrationDataBrazil } from './RegistrationDataBrazil.js';
import { RegistrationDataMexico } from './RegistrationDataMexico.js';
import { RenapoMexico } from './RenapoMexico.js';
import { RestituicaoIRPF } from './RestituicaoIRPF.js';
import { SCRBacen } from './SCRBacen.js';
import { SCRBacenDetalhada } from './SCRBacenDetalhada.js';
import { Score } from './Score.js';
import { SeguroDefeso } from './SeguroDefeso.js';
import { Similarity } from './Similarity.js';
import { SimilarityArgentina } from './SimilarityArgentina.js';
import { SimilarityCrypt } from './SimilarityCrypt.js';
import { SimilarityMexico } from './SimilarityMexico.js';
import { SimplesNacional } from './SimplesNacional.js';
import { Sintegra } from './Sintegra.js';
import { SintegraCCC } from './SintegraCCC.js';
import { SituacaoEleitoral } from './SituacaoEleitoral.js';
import { SuframaCNPJ } from './SuframaCNPJ.js';
import { TCUCertidaoNegativaLicitanteInidoneo } from './TCUCertidaoNegativaLicitanteInidoneo.js';
import { TCUCertidaoNegativaProcesso } from './TCUCertidaoNegativaProcesso.js';
import { TCUConsultaConsolidadaPessoaJuridica } from './TCUConsultaConsolidadaPessoaJuridica.js';
import { TJCertidaoCivelCriminalFiscal } from './TJCertidaoCivelCriminalFiscal.js';
import { TSECertidaodeQuitacaoEleitoral } from './TSECertidaodeQuitacaoEleitoral.js';
import { TSTCertidaoNegativaDebitosTrabalhistas } from './TSTCertidaoNegativaDebitosTrabalhistas.js';
import { TituloLocalVotacao } from './TituloLocalVotacao.js';
import { TribunalJustica } from './TribunalJustica.js';
import { TribunalRegionalFederal } from './TribunalRegionalFederal.js';
import { TribunalRegionalTrabalho } from './TribunalRegionalTrabalho.js';
import { UKHmTreasury } from './UKHmTreasury.js';
import { UnitedNationsSecurityList } from './UnitedNationsSecurityList.js';
import { VerificacaoEmpregadorTrabalhoForcado } from './VerificacaoEmpregadorTrabalhoForcado.js';
import { VinculoEmpregaticio } from './VinculoEmpregaticio.js';
import { VinculosSocietarios } from './VinculosSocietarios.js';

type OperationFactory = (http: IHttpClient) => IDirectDataOperation<unknown>;

export const directDataRegistry: Record<string, OperationFactory> = {
  AML: (http) => new AML(http),
  ANTTConsultaRegularidadeTransportadora: (http) =>
    new ANTTConsultaRegularidadeTransportadora(http),
  APFRural: (http) => new APFRural(http),
  AcordosLeniencia: (http) => new AcordosLeniencia(http),
  AnbimaCertificadoEDU: (http) => new AnbimaCertificadoEDU(http),
  AntifraudePix: (http) => new AntifraudePix(http),
  AuxilioEmergencial: (http) => new AuxilioEmergencial(http),
  AuxilioReconstrucao: (http) => new AuxilioReconstrucao(http),
  BancoCentralInabilitados: (http) => new BancoCentralInabilitados(http),
  BancoCentralProibidos: (http) => new BancoCentralProibidos(http),
  BeneficiarioFinal: (http) => new BeneficiarioFinal(http),
  BeneficioPrestacaoContinuada: (http) => new BeneficioPrestacaoContinuada(http),
  BeneficiosSociais: (http) => new BeneficiosSociais(http),
  BetSafeCompliance: (http) => new BetSafeCompliance(http),
  BoaVistaAcertaCompletoPositivoPF: (http) => new BoaVistaAcertaCompletoPositivoPF(http),
  BoaVistaAcertaMaisPositivoPF: (http) => new BoaVistaAcertaMaisPositivoPF(http),
  BoaVistaDefineLimitePositivoPJ: (http) => new BoaVistaDefineLimitePositivoPJ(http),
  BoaVistaRiscoPositivoPJ: (http) => new BoaVistaRiscoPositivoPJ(http),
  BolsaFamilia: (http) => new BolsaFamilia(http),
  CADINSecretariaFazendaEstaduais: (http) => new CADINSecretariaFazendaEstaduais(http),
  CADINSecretariaFazendaSP: (http) => new CADINSecretariaFazendaSP(http),
  CAFCadastroNacionalAgriculturaPF: (http) => new CAFCadastroNacionalAgriculturaPF(http),
  CAFCadastroNacionalAgriculturaPJ: (http) => new CAFCadastroNacionalAgriculturaPJ(http),
  CARFConselhoAdministrativodeRecursosFiscais: (http) =>
    new CARFConselhoAdministrativodeRecursosFiscais(http),
  CGUConsultoriaGeralUniao: (http) => new CGUConsultoriaGeralUniao(http),
  CNJMandadosPrisao: (http) => new CNJMandadosPrisao(http),
  CONFEA: (http) => new CONFEA(http),
  CVMComissaodeValoresMobiliarios: (http) => new CVMComissaodeValoresMobiliarios(http),
  CVMProcessosAdministrativosSancionadores: (http) =>
    new CVMProcessosAdministrativosSancionadores(http),
  CadastroAmbientalRural: (http) => new CadastroAmbientalRural(http),
  CadastroEmpresasInidoneasSuspensas: (http) => new CadastroEmpresasInidoneasSuspensas(http),
  CadastroEntidadesPrivadasImpedidas: (http) => new CadastroEntidadesPrivadasImpedidas(http),
  CadastroExpulsoesAdministracaoFederal: (http) => new CadastroExpulsoesAdministracaoFederal(http),
  CadastroImoveisRurais: (http) => new CadastroImoveisRurais(http),
  CadastroNacionalEmpresasPunidas: (http) => new CadastroNacionalEmpresasPunidas(http),
  CadastroNacionalImprobidadeAdministrativa: (http) =>
    new CadastroNacionalImprobidadeAdministrativa(http),
  CadastroPessoaFisica: (http) => new CadastroPessoaFisica(http),
  CadastroPessoaFisicaPlus: (http) => new CadastroPessoaFisicaPlus(http),
  CadastroPessoaJuridica: (http) => new CadastroPessoaJuridica(http),
  CadastroPessoaJuridicaPlus: (http) => new CadastroPessoaJuridicaPlus(http),
  CadastroReceitaPessoaFisica: (http) => new CadastroReceitaPessoaFisica(http),
  CaixaRegularidadeEmpregadorFGTS: (http) => new CaixaRegularidadeEmpregadorFGTS(http),
  CarteiraNacionalHabilitacao: (http) => new CarteiraNacionalHabilitacao(http),
  CertidaoConjuntaDebitosPessoaFisica: (http) => new CertidaoConjuntaDebitosPessoaFisica(http),
  CertidaoConjuntaDebitosPessoaJuridica: (http) => new CertidaoConjuntaDebitosPessoaJuridica(http),
  CertidaoNegativaDebitos: (http) => new CertidaoNegativaDebitos(http),
  CertidaoNegativaDebitosImovelRural: (http) => new CertidaoNegativaDebitosImovelRural(http),
  CertidaoNegativaDebitosMunicipal: (http) => new CertidaoNegativaDebitosMunicipal(http),
  ConsultaVeicular: (http) => new ConsultaVeicular(http),
  ConsultaVeicularFipe: (http) => new ConsultaVeicularFipe(http),
  ConsultaVeicularFrotas: (http) => new ConsultaVeicularFrotas(http),
  CorreiosBuscaCEP: (http) => new CorreiosBuscaCEP(http),
  DAPPessoaFisica: (http) => new DAPPessoaFisica(http),
  DAPPessoaJuridica: (http) => new DAPPessoaJuridica(http),
  DetalhamentoNegativo: (http) => new DetalhamentoNegativo(http),
  DossieCreditoCompleto: (http) => new DossieCreditoCompleto(http),
  EUFinancialList: (http) => new EUFinancialList(http),
  EnriquecimentoLead: (http) => new EnriquecimentoLead(http),
  FBIMostWanted: (http) => new FBIMostWanted(http),
  FinCEN: (http) => new FinCEN(http),
  GarantiaSafra: (http) => new GarantiaSafra(http),
  Historico: (http) => new Historico(http),
  HistoricoObterRetornoConsultaAsync: (http) => new HistoricoObterRetornoConsultaAsync(http),
  HistoricoVeiculos: (http) => new HistoricoVeiculos(http),
  IBAMACertidaoNegativaDebitos: (http) => new IBAMACertidaoNegativaDebitos(http),
  IBAMACertidaoNegativaEmbargos: (http) => new IBAMACertidaoNegativaEmbargos(http),
  IBAMACertificadoRegularidade: (http) => new IBAMACertificadoRegularidade(http),
  IBAMAConsultaAutuacoesAmbientais: (http) => new IBAMAConsultaAutuacoesAmbientais(http),
  Interpol: (http) => new Interpol(http),
  MPFCertidaoNegativa: (http) => new MPFCertidaoNegativa(http),
  MPMTMinisterioPublicoMatoGrosso: (http) => new MPMTMinisterioPublicoMatoGrosso(http),
  MTEInfracoesTrabalhistas: (http) => new MTEInfracoesTrabalhistas(http),
  MinisterioPublicoTrabalho: (http) => new MinisterioPublicoTrabalho(http),
  MinisterioTrabalhoPIS: (http) => new MinisterioTrabalhoPIS(http),
  NivelSocioeconomico: (http) => new NivelSocioeconomico(http),
  NivelSocioeconomicoCrypt: (http) => new NivelSocioeconomicoCrypt(http),
  NotaFiscalEletronicaCompleta: (http) => new NotaFiscalEletronicaCompleta(http),
  NotaFiscalEletronicaInutilizacao: (http) => new NotaFiscalEletronicaInutilizacao(http),
  OFAC: (http) => new OFAC(http),
  Obito: (http) => new Obito(http),
  PEPParentescos: (http) => new PEPParentescos(http),
  PETITrabalhoInfantil: (http) => new PETITrabalhoInfantil(http),
  PGFNListaDevedoresUniao: (http) => new PGFNListaDevedoresUniao(http),
  PRFInfracoes: (http) => new PRFInfracoes(http),
  PessoaExpostaPoliticamente: (http) => new PessoaExpostaPoliticamente(http),
  PoliciaCivilAntecedentesCriminais: (http) => new PoliciaCivilAntecedentesCriminais(http),
  PoliciaFederalAntecedentesCriminais: (http) => new PoliciaFederalAntecedentesCriminais(http),
  ProcessosJudiciaisAgrupada: (http) => new ProcessosJudiciaisAgrupada(http),
  ProcessosJudiciaisCompleta: (http) => new ProcessosJudiciaisCompleta(http),
  ProcessosJudiciaisSimplificada: (http) => new ProcessosJudiciaisSimplificada(http),
  ProtestosOnline: (http) => new ProtestosOnline(http),
  ProtestosSP: (http) => new ProtestosSP(http),
  ReceitaFederalPessoaFisica: (http) => new ReceitaFederalPessoaFisica(http),
  ReceitaFederalPessoaJuridica: (http) => new ReceitaFederalPessoaJuridica(http),
  ReceitaPJParticipacaoSocietaria: (http) => new ReceitaPJParticipacaoSocietaria(http),
  RegistrationDataArgentina: (http) => new RegistrationDataArgentina(http),
  RegistrationDataBrazil: (http) => new RegistrationDataBrazil(http),
  RegistrationDataMexico: (http) => new RegistrationDataMexico(http),
  RenapoMexico: (http) => new RenapoMexico(http),
  RestituicaoIRPF: (http) => new RestituicaoIRPF(http),
  SCRBacen: (http) => new SCRBacen(http),
  SCRBacenDetalhada: (http) => new SCRBacenDetalhada(http),
  Score: (http) => new Score(http),
  SeguroDefeso: (http) => new SeguroDefeso(http),
  Similarity: (http) => new Similarity(http),
  SimilarityCrypt: (http) => new SimilarityCrypt(http),
  SimilarityArgentina: (http) => new SimilarityArgentina(http),
  SimilarityMexico: (http) => new SimilarityMexico(http),
  SimplesNacional: (http) => new SimplesNacional(http),
  Sintegra: (http) => new Sintegra(http),
  SintegraCCC: (http) => new SintegraCCC(http),
  SituacaoEleitoral: (http) => new SituacaoEleitoral(http),
  SuframaCNPJ: (http) => new SuframaCNPJ(http),
  TCUCertidaoNegativaLicitanteInidoneo: (http) => new TCUCertidaoNegativaLicitanteInidoneo(http),
  TCUCertidaoNegativaProcesso: (http) => new TCUCertidaoNegativaProcesso(http),
  TCUConsultaConsolidadaPessoaJuridica: (http) => new TCUConsultaConsolidadaPessoaJuridica(http),
  TJCertidaoCivelCriminalFiscal: (http) => new TJCertidaoCivelCriminalFiscal(http),
  TSECertidaodeQuitacaoEleitoral: (http) => new TSECertidaodeQuitacaoEleitoral(http),
  TSTCertidaoNegativaDebitosTrabalhistas: (http) =>
    new TSTCertidaoNegativaDebitosTrabalhistas(http),
  TituloLocalVotacao: (http) => new TituloLocalVotacao(http),
  TribunalJustica: (http) => new TribunalJustica(http),
  TribunalRegionalFederal: (http) => new TribunalRegionalFederal(http),
  TribunalRegionalTrabalho: (http) => new TribunalRegionalTrabalho(http),
  UKHmTreasury: (http) => new UKHmTreasury(http),
  UnitedNationsSecurityList: (http) => new UnitedNationsSecurityList(http),
  VerificacaoEmpregadorTrabalhoForcado: (http) => new VerificacaoEmpregadorTrabalhoForcado(http),
  VinculoEmpregaticio: (http) => new VinculoEmpregaticio(http),
  VinculosSocietarios: (http) => new VinculosSocietarios(http),
};

export function resolveOperation(name: string, http: IHttpClient): IDirectDataOperation<unknown> {
  const factory = directDataRegistry[name];
  if (factory) {
    return factory(http);
  }
  throw new Error(`Operation '${name}' não encontrada no registry`);
}
