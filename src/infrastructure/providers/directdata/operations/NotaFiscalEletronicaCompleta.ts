/**
 * @fileoverview Operation NotaFiscalEletronicaCompleta — DirectData Marketplace API.
 * Endpoint para realizar a consulta NFe - Nota Fiscal Eletrônica - Completa.
 * @module infrastructure/providers/directdata/operations/NotaFiscalEletronicaCompleta
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `NotaFiscalEletronicaCompleta`.
 *
 * @class NotaFiscalEletronicaCompleta
 * @extends {AbstractDirectDataOperation}
 */
export class NotaFiscalEletronicaCompleta extends AbstractDirectDataOperation {
  readonly path = '/api/NotaFiscalEletronicaCompleta';
}
