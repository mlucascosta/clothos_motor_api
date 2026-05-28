/**
 * @fileoverview Registry (Factory) de Operations do Infosimples.
 * Chave = path Infosimples completo (ex: 'consultas/cenprot-sp/protestos').
 * Aliases curtos mantidos para backward-compat.
 * @module infrastructure/providers/infosimples/operations/registry
 */

import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { CadastroPessoaFisica } from './CadastroPessoaFisica.js';
import { CadastroPessoaJuridica } from './CadastroPessoaJuridica.js';
import { CenprotSpProtestos } from './CenprotSpProtestos.js';
import { IeptbProtestos } from './IeptbProtestos.js';
import { IeptbProtestosDetalhes } from './IeptbProtestosDetalhes.js';
import { AntecedenteCriminaisMg } from './AntecedenteCriminaisMg.js';
import { AntecedenteCriminaisPfEmit } from './AntecedenteCriminaisPfEmit.js';
import { AntecedenteCriminaisPfVal } from './AntecedenteCriminaisPfVal.js';
import { AntecedenteCriminaisSp } from './AntecedenteCriminaisSp.js';
import { BcbChequesSemFundo } from './BcbChequesSemFundo.js';
import { BcbValoresReceber } from './BcbValoresReceber.js';
import { B3Participantes } from './B3Participantes.js';
import { CadeProcessos } from './CadeProcessos.js';
import { CvmParticipante } from './CvmParticipante.js';
import { CvmProcessoAdministrativo } from './CvmProcessoAdministrativo.js';
import { CvmSancionadores } from './CvmSancionadores.js';
import { MpfAmazoniaProtege } from './MpfAmazoniaProtege.js';
import { MpfCertidaoNegativa } from './MpfCertidaoNegativa.js';
import { MpfLavaJato } from './MpfLavaJato.js';
import { MpfProcessos } from './MpfProcessos.js';
import { MpSpInquiritoCivil } from './MpSpInquiritoCivil.js';
import { PortalTransparenciaAuxilio } from './PortalTransparenciaAuxilio.js';
import { PortalTransparenciaBolsa } from './PortalTransparenciaBolsa.js';
import { PortalTransparenciaBpc } from './PortalTransparenciaBpc.js';
import { PortalTransparenciaBusca } from './PortalTransparenciaBusca.js';
import { PortalTransparenciaCeaf } from './PortalTransparenciaCeaf.js';
import { PortalTransparenciaCeis } from './PortalTransparenciaCeis.js';
import { PortalTransparenciaCepim } from './PortalTransparenciaCepim.js';
import { PortalTransparenciaCnep } from './PortalTransparenciaCnep.js';
import { PortalTransparenciaConvenios } from './PortalTransparenciaConvenios.js';
import { PortalTransparenciaLeniencia } from './PortalTransparenciaLeniencia.js';
import { PortalTransparenciaPeti } from './PortalTransparenciaPeti.js';
import { PortalTransparenciaRepasse } from './PortalTransparenciaRepasse.js';
import { PortalTransparenciaSafra } from './PortalTransparenciaSafra.js';
import { PortalTransparenciaSeguro } from './PortalTransparenciaSeguro.js';
import { PortalTransparenciaServidor } from './PortalTransparenciaServidor.js';
// Lote 5 — Social
import { CaixaRegularidade } from './CaixaRegularidade.js';
import { FgtsGuia } from './FgtsGuia.js';
import { FgtsGuiaRapida } from './FgtsGuiaRapida.js';
import { DataprevFap } from './DataprevFap.js';
import { DataprevQualificacao } from './DataprevQualificacao.js';
import { CnisPreInscricao } from './CnisPreInscricao.js';
import { FazendaSped } from './FazendaSped.js';
import { SitCaepi } from './SitCaepi.js';
import { SitTrabalhoEscravo } from './SitTrabalhoEscravo.js';
// Lote 6 — Imóveis/Rural
import { CarDemonstrativo } from './CarDemonstrativo.js';
import { CarDemonstrativoPdf } from './CarDemonstrativoPdf.js';
import { CarDownloadShapefile } from './CarDownloadShapefile.js';
import { CarImovel } from './CarImovel.js';
import { IncraCoordenadas } from './IncraCoordenadas.js';
import { IncraSigefDetalhesParcela } from './IncraSigefDetalhesParcela.js';
import { IncraSigefParcelas } from './IncraSigefParcelas.js';
import { IncraSigefRequerimentos } from './IncraSigefRequerimentos.js';
import { SncrCcir } from './SncrCcir.js';
import { SncrImoveis } from './SncrImoveis.js';
import { OnrMapaRegistroImoveis } from './OnrMapaRegistroImoveis.js';
import { IbamaAutuacoes } from './IbamaAutuacoes.js';
import { IbamaCertidaoDebitos } from './IbamaCertidaoDebitos.js';
import { IbamaCertidaoEmbargos } from './IbamaCertidaoEmbargos.js';
import { IbamaCertificadoRegularidade } from './IbamaCertificadoRegularidade.js';
import { DiarioOficialSpValorVenal } from './DiarioOficialSpValorVenal.js';
// Lote 7 — Prefeituras IPTU + Sefaz
import { PrefMgBeloHorizonteCndiptu } from './PrefMgBeloHorizonteCndiptu.js';
import { PrefMgBeloHorizonteIptu } from './PrefMgBeloHorizonteIptu.js';
import { PrefRjRioJaneiroIptu } from './PrefRjRioJaneiroIptu.js';
import { PrefSpCampinasIptu } from './PrefSpCampinasIptu.js';
import { PrefSpSaoPauloDadosImovel } from './PrefSpSaoPauloDadosImovel.js';
import { PrefSpSaoPauloDebitosIptu } from './PrefSpSaoPauloDebitosIptu.js';
import { PrefSpSaoPauloIptu2via } from './PrefSpSaoPauloIptu2via.js';
import { PrefSpSaoPauloIptu } from './PrefSpSaoPauloIptu.js';
import { SefazDfIptu } from './SefazDfIptu.js';
import { SefazSpuCertidaoImoveis } from './SefazSpuCertidaoImoveis.js';
import { SefazSpuDadosImoveis } from './SefazSpuDadosImoveis.js';
// Lote 8 — Registradores
import { RegistradoresCertidDownload } from './RegistradoresCertidDownload.js';
import { RegistradoresCertidPedido } from './RegistradoresCertidPedido.js';
import { RegistradoresCertidRecibo } from './RegistradoresCertidRecibo.js';
import { RegistradoresInfoConta } from './RegistradoresInfoConta.js';
import { RegistradoresMatricDownload } from './RegistradoresMatricDownload.js';
import { RegistradoresMatricLista } from './RegistradoresMatricLista.js';
import { RegistradoresMatricPedido } from './RegistradoresMatricPedido.js';
import { RegistradoresMatricRecibo } from './RegistradoresMatricRecibo.js';

const operationRegistry: Record<string, (http: IHttpClient) => IInfosimplesOperation> = {
  // RFB — path completo
  'consultas/receita-federal/cpf': (http) => new CadastroPessoaFisica(http),
  'consultas/receita-federal/cnpj': (http) => new CadastroPessoaJuridica(http),

  // Protestos
  'consultas/cenprot-sp/protestos': (http) => new CenprotSpProtestos(http),
  'consultas/ieptb/protestos': (http) => new IeptbProtestos(http),
  'consultas/ieptb/protestos/detalhes-sp': (http) => new IeptbProtestosDetalhes(http),

  // Lote 2 — Antecedentes Criminais
  'consultas/antecedentes-criminais/mg': (http) => new AntecedenteCriminaisMg(http),
  'consultas/antecedentes-criminais/pf/emit': (http) => new AntecedenteCriminaisPfEmit(http),
  'consultas/antecedentes-criminais/pf/val': (http) => new AntecedenteCriminaisPfVal(http),
  'consultas/antecedentes-criminais/sp': (http) => new AntecedenteCriminaisSp(http),

  // Lote 3 — BCB, B3, CADE, CVM, MPF, MP-SP
  'consultas/bcb/cheques-sem-fundo': (http) => new BcbChequesSemFundo(http),
  'consultas/bcb/valores-receber': (http) => new BcbValoresReceber(http),
  'consultas/b3/participantes': (http) => new B3Participantes(http),
  'consultas/cade/processos': (http) => new CadeProcessos(http),
  'consultas/cvm/participante': (http) => new CvmParticipante(http),
  'consultas/cvm/processo-administrativo': (http) => new CvmProcessoAdministrativo(http),
  'consultas/cvm/sancionadores': (http) => new CvmSancionadores(http),
  'consultas/mpf/amazonia-protege': (http) => new MpfAmazoniaProtege(http),
  'consultas/mpf/certidao-negativa': (http) => new MpfCertidaoNegativa(http),
  'consultas/mpf/lava-jato': (http) => new MpfLavaJato(http),
  'consultas/mpf/processos': (http) => new MpfProcessos(http),
  'consultas/mp/sp/inquerito-civil': (http) => new MpSpInquiritoCivil(http),

  // Lote 4 — Portal Transparência
  'consultas/portal-transparencia/auxilio': (http) => new PortalTransparenciaAuxilio(http),
  'consultas/portal-transparencia/bolsa': (http) => new PortalTransparenciaBolsa(http),
  'consultas/portal-transparencia/bpc': (http) => new PortalTransparenciaBpc(http),
  'consultas/portal-transparencia/busca': (http) => new PortalTransparenciaBusca(http),
  'consultas/portal-transparencia/ceaf': (http) => new PortalTransparenciaCeaf(http),
  'consultas/portal-transparencia/ceis': (http) => new PortalTransparenciaCeis(http),
  'consultas/portal-transparencia/cepim': (http) => new PortalTransparenciaCepim(http),
  'consultas/portal-transparencia/cnep': (http) => new PortalTransparenciaCnep(http),
  'consultas/portal-transparencia/convenios': (http) => new PortalTransparenciaConvenios(http),
  'consultas/portal-transparencia/leniencia': (http) => new PortalTransparenciaLeniencia(http),
  'consultas/portal-transparencia/peti': (http) => new PortalTransparenciaPeti(http),
  'consultas/portal-transparencia/repasse': (http) => new PortalTransparenciaRepasse(http),
  'consultas/portal-transparencia/safra': (http) => new PortalTransparenciaSafra(http),
  'consultas/portal-transparencia/seguro': (http) => new PortalTransparenciaSeguro(http),
  'consultas/portal-transparencia/servidor': (http) => new PortalTransparenciaServidor(http),

  // Lote 5 — Social
  'consultas/caixa/regularidade': (http) => new CaixaRegularidade(http),
  'consultas/fgts/guia': (http) => new FgtsGuia(http),
  'consultas/fgts/guia-rapida': (http) => new FgtsGuiaRapida(http),
  'consultas/dataprev/fap': (http) => new DataprevFap(http),
  'consultas/dataprev/qualificacao': (http) => new DataprevQualificacao(http),
  'consultas/cnis/pre-inscricao': (http) => new CnisPreInscricao(http),
  'consultas/fazenda/sped': (http) => new FazendaSped(http),
  'consultas/sit/caepi': (http) => new SitCaepi(http),
  'consultas/sit/trabalho-escravo': (http) => new SitTrabalhoEscravo(http),

  // Lote 6 — Imóveis/Rural
  'consultas/car/demonstrativo': (http) => new CarDemonstrativo(http),
  'consultas/car/demonstrativo-pdf': (http) => new CarDemonstrativoPdf(http),
  'consultas/car/download-shapefile': (http) => new CarDownloadShapefile(http),
  'consultas/car/imovel': (http) => new CarImovel(http),
  'consultas/incra/coordenadas': (http) => new IncraCoordenadas(http),
  'consultas/incra/sigef/detalhes-parcela': (http) => new IncraSigefDetalhesParcela(http),
  'consultas/incra/sigef/parcelas': (http) => new IncraSigefParcelas(http),
  'consultas/incra/sigef/requerimentos': (http) => new IncraSigefRequerimentos(http),
  'consultas/sncr/ccir': (http) => new SncrCcir(http),
  'consultas/sncr/imoveis': (http) => new SncrImoveis(http),
  'consultas/onr/mapa-registro-imoveis': (http) => new OnrMapaRegistroImoveis(http),
  'consultas/ibama/autuacoes': (http) => new IbamaAutuacoes(http),
  'consultas/ibama/certidao-debitos': (http) => new IbamaCertidaoDebitos(http),
  'consultas/ibama/certidao-embargos': (http) => new IbamaCertidaoEmbargos(http),
  'consultas/ibama/certificado-regularidade': (http) => new IbamaCertificadoRegularidade(http),
  'consultas/diario-oficial/sp/valor-venal': (http) => new DiarioOficialSpValorVenal(http),

  // Lote 7 — Prefeituras IPTU + Sefaz
  'consultas/pref/mg/belo-horizonte/cndiptu': (http) => new PrefMgBeloHorizonteCndiptu(http),
  'consultas/pref/mg/belo-horizonte/iptu': (http) => new PrefMgBeloHorizonteIptu(http),
  'consultas/pref/rj/rio-janeiro/iptu': (http) => new PrefRjRioJaneiroIptu(http),
  'consultas/pref/sp/campinas/iptu': (http) => new PrefSpCampinasIptu(http),
  'consultas/pref/sp/sao-paulo/dados-imovel': (http) => new PrefSpSaoPauloDadosImovel(http),
  'consultas/pref/sp/sao-paulo/debitos-iptu': (http) => new PrefSpSaoPauloDebitosIptu(http),
  'consultas/pref/sp/sao-paulo/iptu2via': (http) => new PrefSpSaoPauloIptu2via(http),
  'consultas/pref/sp/sao-paulo/iptu': (http) => new PrefSpSaoPauloIptu(http),
  'consultas/sefaz/df/iptu': (http) => new SefazDfIptu(http),
  'consultas/sefaz/spu/certidao-imoveis': (http) => new SefazSpuCertidaoImoveis(http),
  'consultas/sefaz/spu/dados-imoveis': (http) => new SefazSpuDadosImoveis(http),

  // Lote 8 — Registradores
  'consultas/registradores/certid/download': (http) => new RegistradoresCertidDownload(http),
  'consultas/registradores/certid/pedido': (http) => new RegistradoresCertidPedido(http),
  'consultas/registradores/certid/recibo': (http) => new RegistradoresCertidRecibo(http),
  'consultas/registradores/info-conta': (http) => new RegistradoresInfoConta(http),
  'consultas/registradores/matric/download': (http) => new RegistradoresMatricDownload(http),
  'consultas/registradores/matric/lista': (http) => new RegistradoresMatricLista(http),
  'consultas/registradores/matric/pedido': (http) => new RegistradoresMatricPedido(http),
  'consultas/registradores/matric/recibo': (http) => new RegistradoresMatricRecibo(http),

  // Aliases curtos (backward-compat)
  cpf: (http) => new CadastroPessoaFisica(http),
  cnpj: (http) => new CadastroPessoaJuridica(http),
};

/**
 * Resolve uma operation pelo path do endpoint.
 * Aceita path completo ('consultas/cenprot-sp/protestos') ou alias curto ('cpf').
 * Case-insensitive; barras preservadas para lookup por path.
 *
 * @throws {Error} Se operação não existe no registry
 */
export function resolveOperation(
  registryKey: string,
  http: IHttpClient,
): IInfosimplesOperation {
  const normalized = registryKey.toLowerCase();
  const factory = operationRegistry[normalized];

  if (!factory) {
    throw new Error(`Operação Infosimples desconhecida: ${registryKey}`);
  }

  return factory(http);
}

export function listSupportedOperations(): string[] {
  return Object.keys(operationRegistry);
}
