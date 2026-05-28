// PATCH LOTE 7+8 — adicionar em registry.ts:
//
// imports a adicionar no topo:
// import { PrefMgBeloHorizonteCndiptu } from './PrefMgBeloHorizonteCndiptu.js';
// import { PrefMgBeloHorizonteIptu } from './PrefMgBeloHorizonteIptu.js';
// import { PrefRjRioJaneiroIptu } from './PrefRjRioJaneiroIptu.js';
// import { PrefSpCampinasIptu } from './PrefSpCampinasIptu.js';
// import { PrefSpSaoPauloDadosImovel } from './PrefSpSaoPauloDadosImovel.js';
// import { PrefSpSaoPauloDebitosIptu } from './PrefSpSaoPauloDebitosIptu.js';
// import { PrefSpSaoPauloIptu2via } from './PrefSpSaoPauloIptu2via.js';
// import { PrefSpSaoPauloIptu } from './PrefSpSaoPauloIptu.js';
// import { SefazDfIptu } from './SefazDfIptu.js';
// import { SefazSpuCertidaoImoveis } from './SefazSpuCertidaoImoveis.js';
// import { SefazSpuDadosImoveis } from './SefazSpuDadosImoveis.js';
// import { RegistradoresCertidDownload } from './RegistradoresCertidDownload.js';
// import { RegistradoresCertidPedido } from './RegistradoresCertidPedido.js';
// import { RegistradoresCertidRecibo } from './RegistradoresCertidRecibo.js';
// import { RegistradoresInfoConta } from './RegistradoresInfoConta.js';
// import { RegistradoresMatricDownload } from './RegistradoresMatricDownload.js';
// import { RegistradoresMatricLista } from './RegistradoresMatricLista.js';
// import { RegistradoresMatricPedido } from './RegistradoresMatricPedido.js';
// import { RegistradoresMatricRecibo } from './RegistradoresMatricRecibo.js';
//
// entradas a adicionar em operationRegistry:
//
// // Lote 7 — Prefeituras IPTU + Sefaz
// 'consultas/pref/mg/belo-horizonte/cndiptu': (http) => new PrefMgBeloHorizonteCndiptu(http),
// 'consultas/pref/mg/belo-horizonte/iptu': (http) => new PrefMgBeloHorizonteIptu(http),
// 'consultas/pref/rj/rio-janeiro/iptu': (http) => new PrefRjRioJaneiroIptu(http),
// 'consultas/pref/sp/campinas/iptu': (http) => new PrefSpCampinasIptu(http),
// 'consultas/pref/sp/sao-paulo/dados-imovel': (http) => new PrefSpSaoPauloDadosImovel(http),
// 'consultas/pref/sp/sao-paulo/debitos-iptu': (http) => new PrefSpSaoPauloDebitosIptu(http),
// 'consultas/pref/sp/sao-paulo/iptu2via': (http) => new PrefSpSaoPauloIptu2via(http),
// 'consultas/pref/sp/sao-paulo/iptu': (http) => new PrefSpSaoPauloIptu(http),
// 'consultas/sefaz/df/iptu': (http) => new SefazDfIptu(http),
// 'consultas/sefaz/spu/certidao-imoveis': (http) => new SefazSpuCertidaoImoveis(http),
// 'consultas/sefaz/spu/dados-imoveis': (http) => new SefazSpuDadosImoveis(http),
//
// // Lote 8 — Registradores
// 'consultas/registradores/certid/download': (http) => new RegistradoresCertidDownload(http),
// 'consultas/registradores/certid/pedido': (http) => new RegistradoresCertidPedido(http),
// 'consultas/registradores/certid/recibo': (http) => new RegistradoresCertidRecibo(http),
// 'consultas/registradores/info-conta': (http) => new RegistradoresInfoConta(http),
// 'consultas/registradores/matric/download': (http) => new RegistradoresMatricDownload(http),
// 'consultas/registradores/matric/lista': (http) => new RegistradoresMatricLista(http),
// 'consultas/registradores/matric/pedido': (http) => new RegistradoresMatricPedido(http),
// 'consultas/registradores/matric/recibo': (http) => new RegistradoresMatricRecibo(http),
