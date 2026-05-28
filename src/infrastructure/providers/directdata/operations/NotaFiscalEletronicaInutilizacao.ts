/**
 * @fileoverview Operation NotaFiscalEletronicaInutilizacao — DirectData Marketplace API.
 * Endpoint para realizar a consulta NFe - Nota Fiscal Eletrônica - Inutilizações.
 * @module infrastructure/providers/directdata/operations/NotaFiscalEletronicaInutilizacao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `NotaFiscalEletronicaInutilizacao`.
 *
 * @class NotaFiscalEletronicaInutilizacao
 * @extends {AbstractDirectDataOperation}
 */
export class NotaFiscalEletronicaInutilizacao extends AbstractDirectDataOperation {
  readonly path = '/api/NotaFiscalEletronicaInutilizacao';
}
