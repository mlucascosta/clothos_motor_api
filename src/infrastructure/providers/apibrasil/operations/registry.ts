/**
 * @fileoverview Registry/factory de todas as operations do APIBrasil.
 * @module infrastructure/providers/apibrasil/operations/registry
 */

import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IApiBrasilOperation } from '../ports/IApiBrasilOperation.js';

import { AcertaCompletoPositivoPf } from './AcertaCompletoPositivoPf.js';
import { AcertaEssencial } from './AcertaEssencial.js';
import { AcertaEssencialPositivo } from './AcertaEssencialPositivo.js';
import { AcoesProcessosJudiciais } from './AcoesProcessosJudiciais.js';
import { AgregadosBasica } from './AgregadosBasica.js';
import { AgregadosChassi } from './AgregadosChassi.js';
import { AgregadosIndicioSinistro } from './AgregadosIndicioSinistro.js';
import { AgregadosPropria } from './AgregadosPropria.js';
import { AgregadosRenavam } from './AgregadosRenavam.js';
import { AgregadosRenavamV2 } from './AgregadosRenavamV2.js';
import { AgregadosV2 } from './AgregadosV2.js';
import { AmlVinculosSocietarios } from './AmlVinculosSocietarios.js';
import { AnaliseCreditoBasicPf } from './AnaliseCreditoBasicPf.js';
import { AnaliseCreditoBasicPj } from './AnaliseCreditoBasicPj.js';
import { AnaliseCreditoBusiness } from './AnaliseCreditoBusiness.js';
import { AnaliseCreditoCompletePf } from './AnaliseCreditoCompletePf.js';
import { AnaliseCreditoEssencialPf } from './AnaliseCreditoEssencialPf.js';
import { AnaliseCreditoPlusPf } from './AnaliseCreditoPlusPf.js';
import { AnaliticoVeicular } from './AnaliticoVeicular.js';
import { AntecedentesCriminais } from './AntecedentesCriminais.js';
import { AntifraudeChavePix } from './AntifraudeChavePix.js';
import { ApiRntrc } from './ApiRntrc.js';
import { BancoCentralInabilitados } from './BancoCentralInabilitados.js';
import { BaseEstadualV3 } from './BaseEstadualV3.js';
import { BaseNacionalOnline } from './BaseNacionalOnline.js';
import { BaseNacionalV2 } from './BaseNacionalV2.js';
import { BetSafeCompliance } from './BetSafeCompliance.js';
import { CalculaDistanciaCep } from './CalculaDistanciaCep.js';
import { Cep } from './Cep.js';
import { CertidaoConjuntaDeDebitosPessoaFisica } from './CertidaoConjuntaDeDebitosPessoaFisica.js';
import { CertidaoConjuntaDeDebitosPessoaJuridica } from './CertidaoConjuntaDeDebitosPessoaJuridica.js';
import { CertidaoNegativaDeDebitos } from './CertidaoNegativaDeDebitos.js';
import { CertidaoNegativaDeDebitosPj } from './CertidaoNegativaDeDebitosPj.js';
import { CertidaoNegativaDeLicitanteInidoneo } from './CertidaoNegativaDeLicitanteInidoneo.js';
import { CheckList } from './CheckList.js';
import { ChipVirtual } from './ChipVirtual.js';
import { CnhCriminals } from './CnhCriminals.js';
import { CnhPorCpf } from './CnhPorCpf.js';
import { Cnpj } from './Cnpj.js';
import { CnpjCadastral } from './CnpjCadastral.js';
import { CnpjSearch } from './CnpjSearch.js';
import { ComplianceBasic } from './ComplianceBasic.js';
import { ComplianceBasicPj } from './ComplianceBasicPj.js';
import { ComplianceComplete } from './ComplianceComplete.js';
import { ComplianceCompletePj } from './ComplianceCompletePj.js';
import { ConsultaConsolidadaDePessoaJuridica } from './ConsultaConsolidadaDePessoaJuridica.js';
import { CpfDados } from './CpfDados.js';
import { CpfHotline } from './CpfHotline.js';
import { CpfImpedidos } from './CpfImpedidos.js';
import { CpfLite } from './CpfLite.js';
import { CpfObitoGrupoCadastral } from './CpfObitoGrupoCadastral.js';
import { CpfRelatorio } from './CpfRelatorio.js';
import { CpfSearch } from './CpfSearch.js';
import { CpfSearchMae } from './CpfSearchMae.js';
import { CpfSociodemograficos } from './CpfSociodemograficos.js';
import { Crbm } from './Crbm.js';
import { CreditosSimplesPf } from './CreditosSimplesPf.js';
import { CreditosSimplesPj } from './CreditosSimplesPj.js';
import { Crlve } from './Crlve.js';
import { Crm } from './Crm.js';
import { Cro } from './Cro.js';
import { CsvRenainfRenajudBinProprietario } from './CsvRenainfRenajudBinProprietario.js';
import { DadosCadastrais } from './DadosCadastrais.js';
import { DddAnatel } from './DddAnatel.js';
import { DebitosRestricoes } from './DebitosRestricoes.js';
import { DebitosV4 } from './DebitosV4.js';
import { DecodificadorAgregados } from './DecodificadorAgregados.js';
import { DecodificadorPrecificador } from './DecodificadorPrecificador.js';
import { DefineRiscoPj } from './DefineRiscoPj.js';
import { DetalhamentoNegativo } from './DetalhamentoNegativo.js';
import { DividaAtiva } from './DividaAtiva.js';
import { DocumentoFrota } from './DocumentoFrota.js';
import { EmissaoNotas } from './EmissaoNotas.js';
import { EnderecoTelefonePorPlaca } from './EnderecoTelefonePorPlaca.js';
import { EnriquecimentoDeLead } from './EnriquecimentoDeLead.js';
import { Estadual } from './Estadual.js';
import { Farol } from './Farol.js';
import { FgtsRegularidadeDoEmpregador } from './FgtsRegularidadeDoEmpregador.js';
import { FichaTecnica } from './FichaTecnica.js';
import { Fipe } from './Fipe.js';
import { FipeChassi } from './FipeChassi.js';
import { FreteAntt } from './FreteAntt.js';
import { Gravame } from './Gravame.js';
import { GravameV2 } from './GravameV2.js';
import { HistoricoAlteracoesEmpresa } from './HistoricoAlteracoesEmpresa.js';
import { HistoricoKm } from './HistoricoKm.js';
import { HistoricoProprietario } from './HistoricoProprietario.js';
import { HistoricoVeiculosPfPj } from './HistoricoVeiculosPfPj.js';
import { Leilao } from './Leilao.js';
import { LeilaoCompletoScore } from './LeilaoCompletoScore.js';
import { LeilaoConjugado } from './LeilaoConjugado.js';
import { LeilaoSintetico } from './LeilaoSintetico.js';
import { LeilaoV2 } from './LeilaoV2.js';
import { LigacoesUra } from './LigacoesUra.js';
import { LimitePj } from './LimitePj.js';
import { LimitePositivoPj } from './LimitePositivoPj.js';
import { Nacional } from './Nacional.js';
import { Obito } from './Obito.js';
import { PepListaRestritiva } from './PepListaRestritiva.js';
import { PessoaExpostaPoliticamente } from './PessoaExpostaPoliticamente.js';
import { PessoaExpostaPoliticamenteParentesco } from './PessoaExpostaPoliticamenteParentesco.js';
import { ProprietarioAtual } from './ProprietarioAtual.js';
import { ProprietarioAtualV2 } from './ProprietarioAtualV2.js';
import { ProtestoNacionalV2 } from './ProtestoNacionalV2.js';
import { ProtestosNacionalBase } from './ProtestosNacionalBase.js';
import { ProtestosSp } from './ProtestosSp.js';
import { ProxyBuy } from './ProxyBuy.js';
import { QuodPj } from './QuodPj.js';
import { QuodRestricaoPf } from './QuodRestricaoPf.js';
import { QuodRestricaoPj } from './QuodRestricaoPj.js';
import { Rastreio } from './Rastreio.js';
import { Recall } from './Recall.js';
import { RecallV2 } from './RecallV2.js';
import { ReceitaFederal } from './ReceitaFederal.js';
import { ReceitaFederalPf } from './ReceitaFederalPf.js';
import { ReceitaFederalPfV3 } from './ReceitaFederalPfV3.js';
import { ReceitaFederalPjV3 } from './ReceitaFederalPjV3.js';
import { RelatorioPositivo } from './RelatorioPositivo.js';
import { RelatorioPositivoPj } from './RelatorioPositivoPj.js';
import { RelatorioVeicular } from './RelatorioVeicular.js';
import { Renainf } from './Renainf.js';
import { Renajud } from './Renajud.js';
import { RiscoPositivoPj } from './RiscoPositivoPj.js';
import { RouboFurto } from './RouboFurto.js';
import { RouboFurtoV2 } from './RouboFurtoV2.js';
import { ScoreCreditoQuod } from './ScoreCreditoQuod.js';
import { ScrAnaliticoResumoBacen } from './ScrAnaliticoResumoBacen.js';
import { ScrAnaliticoResumoBacenPj } from './ScrAnaliticoResumoBacenPj.js';
import { ScrBacenScore } from './ScrBacenScore.js';
import { SecretariaDaFazendaSaoPaulo } from './SecretariaDaFazendaSaoPaulo.js';
import { SimplesNacional } from './SimplesNacional.js';
import { SintegraCadastrosEstaduais } from './SintegraCadastrosEstaduais.js';
import { SituacaoEleitoral } from './SituacaoEleitoral.js';
import { Sms } from './Sms.js';
import { SpcBoaVista } from './SpcBoaVista.js';
import { SpcTerceirosPf } from './SpcTerceirosPf.js';
import { SpcTerceirosPj } from './SpcTerceirosPj.js';
import { TabelaFipe } from './TabelaFipe.js';
import { TelefoneOperadora } from './TelefoneOperadora.js';
import { TransacionalPj } from './TransacionalPj.js';
import { Var } from './Var.js';
import { VeicularAgrupados } from './VeicularAgrupados.js';
import { VeiculosDadosV1 } from './VeiculosDadosV1.js';
import { VeiculosDocumentoPf } from './VeiculosDocumentoPf.js';
import { VeiculosDocumentoPj } from './VeiculosDocumentoPj.js';
import { VeiculosTotal } from './VeiculosTotal.js';
import { VinculoEmpregaticio } from './VinculoEmpregaticio.js';
import { VipCar } from './VipCar.js';

type OperationFactory = (http: IHttpClient) => IApiBrasilOperation;

export const apibrasilRegistry: Record<string, OperationFactory> = {
  acerta_completo_positivo_pf: (http) => new AcertaCompletoPositivoPf(http),
  acerta_essencial: (http) => new AcertaEssencial(http),
  acerta_essencial_positivo: (http) => new AcertaEssencialPositivo(http),
  acoes_processos_judiciais: (http) => new AcoesProcessosJudiciais(http),
  agregados_basica: (http) => new AgregadosBasica(http),
  agregados_chassi: (http) => new AgregadosChassi(http),
  agregados_indicio_sinistro: (http) => new AgregadosIndicioSinistro(http),
  agregados_propria: (http) => new AgregadosPropria(http),
  agregados_renavam: (http) => new AgregadosRenavam(http),
  agregados_renavam_v2: (http) => new AgregadosRenavamV2(http),
  agregados_v2: (http) => new AgregadosV2(http),
  aml_vinculos_societarios: (http) => new AmlVinculosSocietarios(http),
  analise_credito_basic_pf: (http) => new AnaliseCreditoBasicPf(http),
  analise_credito_basic_pj: (http) => new AnaliseCreditoBasicPj(http),
  analise_credito_business: (http) => new AnaliseCreditoBusiness(http),
  analise_credito_complete_pf: (http) => new AnaliseCreditoCompletePf(http),
  analise_credito_essencial_pf: (http) => new AnaliseCreditoEssencialPf(http),
  analise_credito_plus_pf: (http) => new AnaliseCreditoPlusPf(http),
  analitico_veicular: (http) => new AnaliticoVeicular(http),
  antecedentes_criminais: (http) => new AntecedentesCriminais(http),
  antifraude_chave_pix: (http) => new AntifraudeChavePix(http),
  api_rntrc: (http) => new ApiRntrc(http),
  banco_central_inabilitados: (http) => new BancoCentralInabilitados(http),
  base_estadual_v3: (http) => new BaseEstadualV3(http),
  base_nacional_online: (http) => new BaseNacionalOnline(http),
  base_nacional_v2: (http) => new BaseNacionalV2(http),
  bet_safe_compliance: (http) => new BetSafeCompliance(http),
  calcula_distancia_cep: (http) => new CalculaDistanciaCep(http),
  cep: (http) => new Cep(http),
  certidao_conjunta_de_debitos_pessoa_fisica: (http) => new CertidaoConjuntaDeDebitosPessoaFisica(http),
  certidao_conjunta_de_debitos_pessoa_juridica: (http) => new CertidaoConjuntaDeDebitosPessoaJuridica(http),
  certidao_negativa_de_debitos: (http) => new CertidaoNegativaDeDebitos(http),
  certidao_negativa_de_debitos_pj: (http) => new CertidaoNegativaDeDebitosPj(http),
  certidao_negativa_de_licitante_inidoneo: (http) => new CertidaoNegativaDeLicitanteInidoneo(http),
  check_list: (http) => new CheckList(http),
  chip_virtual: (http) => new ChipVirtual(http),
  cnh_criminals: (http) => new CnhCriminals(http),
  cnh_por_cpf: (http) => new CnhPorCpf(http),
  cnpj: (http) => new Cnpj(http),
  cnpj_cadastral: (http) => new CnpjCadastral(http),
  cnpj_search: (http) => new CnpjSearch(http),
  compliance_basic: (http) => new ComplianceBasic(http),
  compliance_basic_pj: (http) => new ComplianceBasicPj(http),
  compliance_complete: (http) => new ComplianceComplete(http),
  compliance_complete_pj: (http) => new ComplianceCompletePj(http),
  consulta_consolidada_de_pessoa_juridica: (http) => new ConsultaConsolidadaDePessoaJuridica(http),
  cpf_dados: (http) => new CpfDados(http),
  cpf_hotline: (http) => new CpfHotline(http),
  cpf_impedidos: (http) => new CpfImpedidos(http),
  cpf_lite: (http) => new CpfLite(http),
  cpf_obito_grupo_cadastral: (http) => new CpfObitoGrupoCadastral(http),
  cpf_relatorio: (http) => new CpfRelatorio(http),
  cpf_search: (http) => new CpfSearch(http),
  cpf_search_mae: (http) => new CpfSearchMae(http),
  cpf_sociodemograficos: (http) => new CpfSociodemograficos(http),
  crbm: (http) => new Crbm(http),
  creditos_simples_pf: (http) => new CreditosSimplesPf(http),
  creditos_simples_pj: (http) => new CreditosSimplesPj(http),
  crlve: (http) => new Crlve(http),
  crm: (http) => new Crm(http),
  cro: (http) => new Cro(http),
  csv_renainf_renajud_bin_proprietario: (http) => new CsvRenainfRenajudBinProprietario(http),
  dados_cadastrais: (http) => new DadosCadastrais(http),
  ddd_anatel: (http) => new DddAnatel(http),
  debitos_restricoes: (http) => new DebitosRestricoes(http),
  debitos_v4: (http) => new DebitosV4(http),
  decodificador_agregados: (http) => new DecodificadorAgregados(http),
  decodificador_precificador: (http) => new DecodificadorPrecificador(http),
  define_risco_pj: (http) => new DefineRiscoPj(http),
  detalhamento_negativo: (http) => new DetalhamentoNegativo(http),
  divida_ativa: (http) => new DividaAtiva(http),
  documento_frota: (http) => new DocumentoFrota(http),
  emissao_notas: (http) => new EmissaoNotas(http),
  endereco_telefone_por_placa: (http) => new EnderecoTelefonePorPlaca(http),
  enriquecimento_de_lead: (http) => new EnriquecimentoDeLead(http),
  estadual: (http) => new Estadual(http),
  farol: (http) => new Farol(http),
  fgts_regularidade_do_empregador: (http) => new FgtsRegularidadeDoEmpregador(http),
  ficha_tecnica: (http) => new FichaTecnica(http),
  fipe: (http) => new Fipe(http),
  fipe_chassi: (http) => new FipeChassi(http),
  frete_antt: (http) => new FreteAntt(http),
  gravame: (http) => new Gravame(http),
  gravame_v2: (http) => new GravameV2(http),
  historico_alteracoes_empresa: (http) => new HistoricoAlteracoesEmpresa(http),
  historico_km: (http) => new HistoricoKm(http),
  historico_proprietario: (http) => new HistoricoProprietario(http),
  historico_veiculos_pf_pj: (http) => new HistoricoVeiculosPfPj(http),
  leilao: (http) => new Leilao(http),
  leilao_completo_score: (http) => new LeilaoCompletoScore(http),
  leilao_conjugado: (http) => new LeilaoConjugado(http),
  leilao_sintetico: (http) => new LeilaoSintetico(http),
  leilao_v2: (http) => new LeilaoV2(http),
  ligacoes_ura: (http) => new LigacoesUra(http),
  limite_pj: (http) => new LimitePj(http),
  limite_positivo_pj: (http) => new LimitePositivoPj(http),
  nacional: (http) => new Nacional(http),
  obito: (http) => new Obito(http),
  pep_lista_restritiva: (http) => new PepListaRestritiva(http),
  pessoa_exposta_politicamente: (http) => new PessoaExpostaPoliticamente(http),
  pessoa_exposta_politicamente_parentesco: (http) => new PessoaExpostaPoliticamenteParentesco(http),
  proprietario_atual: (http) => new ProprietarioAtual(http),
  proprietario_atual_v2: (http) => new ProprietarioAtualV2(http),
  protesto_nacional_v2: (http) => new ProtestoNacionalV2(http),
  protestos_nacional_base: (http) => new ProtestosNacionalBase(http),
  protestos_sp: (http) => new ProtestosSp(http),
  proxy_buy: (http) => new ProxyBuy(http),
  quod_pj: (http) => new QuodPj(http),
  quod_restricao_pf: (http) => new QuodRestricaoPf(http),
  quod_restricao_pj: (http) => new QuodRestricaoPj(http),
  rastreio: (http) => new Rastreio(http),
  recall: (http) => new Recall(http),
  recall_v2: (http) => new RecallV2(http),
  receita_federal: (http) => new ReceitaFederal(http),
  receita_federal_pf: (http) => new ReceitaFederalPf(http),
  receita_federal_pf_v3: (http) => new ReceitaFederalPfV3(http),
  receita_federal_pj_v3: (http) => new ReceitaFederalPjV3(http),
  relatorio_positivo: (http) => new RelatorioPositivo(http),
  relatorio_positivo_pj: (http) => new RelatorioPositivoPj(http),
  relatorio_veicular: (http) => new RelatorioVeicular(http),
  renainf: (http) => new Renainf(http),
  renajud: (http) => new Renajud(http),
  risco_positivo_pj: (http) => new RiscoPositivoPj(http),
  roubo_furto: (http) => new RouboFurto(http),
  roubo_furto_v2: (http) => new RouboFurtoV2(http),
  score_credito_quod: (http) => new ScoreCreditoQuod(http),
  scr_analitico_resumo_bacen: (http) => new ScrAnaliticoResumoBacen(http),
  scr_analitico_resumo_bacen_pj: (http) => new ScrAnaliticoResumoBacenPj(http),
  scr_bacen_score: (http) => new ScrBacenScore(http),
  secretaria_da_fazenda_sao_paulo: (http) => new SecretariaDaFazendaSaoPaulo(http),
  simples_nacional: (http) => new SimplesNacional(http),
  sintegra_cadastros_estaduais: (http) => new SintegraCadastrosEstaduais(http),
  situacao_eleitoral: (http) => new SituacaoEleitoral(http),
  sms: (http) => new Sms(http),
  spc_boa_vista: (http) => new SpcBoaVista(http),
  spc_terceiros_pf: (http) => new SpcTerceirosPf(http),
  spc_terceiros_pj: (http) => new SpcTerceirosPj(http),
  tabela_fipe: (http) => new TabelaFipe(http),
  telefone_operadora: (http) => new TelefoneOperadora(http),
  transacional_pj: (http) => new TransacionalPj(http),
  var: (http) => new Var(http),
  veicular_agrupados: (http) => new VeicularAgrupados(http),
  veiculos_dados_v1: (http) => new VeiculosDadosV1(http),
  veiculos_documento_pf: (http) => new VeiculosDocumentoPf(http),
  veiculos_documento_pj: (http) => new VeiculosDocumentoPj(http),
  veiculos_total: (http) => new VeiculosTotal(http),
  vinculo_empregaticio: (http) => new VinculoEmpregaticio(http),
  vip_car: (http) => new VipCar(http),
};

export function resolveOperation(name: string, http: IHttpClient): IApiBrasilOperation {
  const factory = apibrasilRegistry[name];
  if (factory) {
    return factory(http);
  }
  throw new Error(`Operation '${name}' não encontrada no registry apibrasil`);
}
