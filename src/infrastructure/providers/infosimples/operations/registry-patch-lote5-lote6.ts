// PATCH LOTE 5+6 — adicionar em registry.ts:
//
// Imports a adicionar:
// import { CaixaRegularidade } from './CaixaRegularidade.js';
// import { FgtsGuia } from './FgtsGuia.js';
// import { FgtsGuiaRapida } from './FgtsGuiaRapida.js';
// import { DataprevFap } from './DataprevFap.js';
// import { DataprevQualificacao } from './DataprevQualificacao.js';
// import { CnisPreInscricao } from './CnisPreInscricao.js';
// import { FazendaSped } from './FazendaSped.js';
// import { SitCaepi } from './SitCaepi.js';
// import { SitTrabalhoEscravo } from './SitTrabalhoEscravo.js';
// import { CarDemonstrativo } from './CarDemonstrativo.js';
// import { CarDemonstrativoPdf } from './CarDemonstrativoPdf.js';
// import { CarDownloadShapefile } from './CarDownloadShapefile.js';
// import { CarImovel } from './CarImovel.js';
// import { IncraCoordenadas } from './IncraCoordenadas.js';
// import { IncraSigefDetalhesParcela } from './IncraSigefDetalhesParcela.js';
// import { IncraSigefParcelas } from './IncraSigefParcelas.js';
// import { IncraSigefRequerimentos } from './IncraSigefRequerimentos.js';
// import { SncrCcir } from './SncrCcir.js';
// import { SncrImoveis } from './SncrImoveis.js';
// import { OnrMapaRegistroImoveis } from './OnrMapaRegistroImoveis.js';
// import { IbamaAutuacoes } from './IbamaAutuacoes.js';
// import { IbamaCertidaoDebitos } from './IbamaCertidaoDebitos.js';
// import { IbamaCertidaoEmbargos } from './IbamaCertidaoEmbargos.js';
// import { IbamaCertificadoRegularidade } from './IbamaCertificadoRegularidade.js';
// import { DiarioOficialSpValorVenal } from './DiarioOficialSpValorVenal.js';
//
// Entradas a adicionar em operationRegistry:
//
// // Lote 5 — Social
// 'consultas/caixa/regularidade': (http) => new CaixaRegularidade(http),
// 'consultas/fgts/guia': (http) => new FgtsGuia(http),
// 'consultas/fgts/guia-rapida': (http) => new FgtsGuiaRapida(http),
// 'consultas/dataprev/fap': (http) => new DataprevFap(http),
// 'consultas/dataprev/qualificacao': (http) => new DataprevQualificacao(http),
// 'consultas/cnis/pre-inscricao': (http) => new CnisPreInscricao(http),
// 'consultas/fazenda/sped': (http) => new FazendaSped(http),
// 'consultas/sit/caepi': (http) => new SitCaepi(http),
// 'consultas/sit/trabalho-escravo': (http) => new SitTrabalhoEscravo(http),
//
// // Lote 6 — Imóveis/Rural
// 'consultas/car/demonstrativo': (http) => new CarDemonstrativo(http),
// 'consultas/car/demonstrativo-pdf': (http) => new CarDemonstrativoPdf(http),
// 'consultas/car/download-shapefile': (http) => new CarDownloadShapefile(http),
// 'consultas/car/imovel': (http) => new CarImovel(http),
// 'consultas/incra/coordenadas': (http) => new IncraCoordenadas(http),
// 'consultas/incra/sigef/detalhes-parcela': (http) => new IncraSigefDetalhesParcela(http),
// 'consultas/incra/sigef/parcelas': (http) => new IncraSigefParcelas(http),
// 'consultas/incra/sigef/requerimentos': (http) => new IncraSigefRequerimentos(http),
// 'consultas/sncr/ccir': (http) => new SncrCcir(http),
// 'consultas/sncr/imoveis': (http) => new SncrImoveis(http),
// 'consultas/onr/mapa-registro-imoveis': (http) => new OnrMapaRegistroImoveis(http),
// 'consultas/ibama/autuacoes': (http) => new IbamaAutuacoes(http),
// 'consultas/ibama/certidao-debitos': (http) => new IbamaCertidaoDebitos(http),
// 'consultas/ibama/certidao-embargos': (http) => new IbamaCertidaoEmbargos(http),
// 'consultas/ibama/certificado-regularidade': (http) => new IbamaCertificadoRegularidade(http),
// 'consultas/diario-oficial/sp/valor-venal': (http) => new DiarioOficialSpValorVenal(http),
