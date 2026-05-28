// PATCH LOTE 2+3 — adicionar em registry.ts:
//
// import { AntecedenteCriminaisMg } from './AntecedenteCriminaisMg.js';
// import { AntecedenteCriminaisPfEmit } from './AntecedenteCriminaisPfEmit.js';
// import { AntecedenteCriminaisPfVal } from './AntecedenteCriminaisPfVal.js';
// import { AntecedenteCriminaisSp } from './AntecedenteCriminaisSp.js';
// import { BcbChequesSemFundo } from './BcbChequesSemFundo.js';
// import { BcbValoresReceber } from './BcbValoresReceber.js';
// import { B3Participantes } from './B3Participantes.js';
// import { CadeProcessos } from './CadeProcessos.js';
// import { CvmParticipante } from './CvmParticipante.js';
// import { CvmProcessoAdministrativo } from './CvmProcessoAdministrativo.js';
// import { CvmSancionadores } from './CvmSancionadores.js';
// import { MpfAmazoniaProtege } from './MpfAmazoniaProtege.js';
// import { MpfCertidaoNegativa } from './MpfCertidaoNegativa.js';
// import { MpfLavaJato } from './MpfLavaJato.js';
// import { MpfProcessos } from './MpfProcessos.js';
// import { MpSpInquiritoCivil } from './MpSpInquiritoCivil.js';
//
// Entradas no operationRegistry:
//   // Lote 2 — Antecedentes Criminais
//   'consultas/antecedentes-criminais/mg': (http) => new AntecedenteCriminaisMg(http),
//   'consultas/antecedentes-criminais/pf/emit': (http) => new AntecedenteCriminaisPfEmit(http),
//   'consultas/antecedentes-criminais/pf/val': (http) => new AntecedenteCriminaisPfVal(http),
//   'consultas/antecedentes-criminais/sp': (http) => new AntecedenteCriminaisSp(http),
//
//   // Lote 3 — BCB, B3, CADE, CVM, MPF, MP-SP
//   'consultas/bcb/cheques-sem-fundo': (http) => new BcbChequesSemFundo(http),
//   'consultas/bcb/valores-receber': (http) => new BcbValoresReceber(http),
//   'consultas/b3/participantes': (http) => new B3Participantes(http),
//   'consultas/cade/processos': (http) => new CadeProcessos(http),
//   'consultas/cvm/participante': (http) => new CvmParticipante(http),
//   'consultas/cvm/processo-administrativo': (http) => new CvmProcessoAdministrativo(http),
//   'consultas/cvm/sancionadores': (http) => new CvmSancionadores(http),
//   'consultas/mpf/amazonia-protege': (http) => new MpfAmazoniaProtege(http),
//   'consultas/mpf/certidao-negativa': (http) => new MpfCertidaoNegativa(http),
//   'consultas/mpf/lava-jato': (http) => new MpfLavaJato(http),
//   'consultas/mpf/processos': (http) => new MpfProcessos(http),
//   'consultas/mp/sp/inquerito-civil': (http) => new MpSpInquiritoCivil(http),
