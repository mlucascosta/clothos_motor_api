/**
 * @fileoverview Operation TCUCertidaoNegativaProcesso — DirectData Marketplace API.
 * Endpoint para realizar a consulta TCU - Certidão Negativa de Processo.
 * @module infrastructure/providers/directdata/operations/TCUCertidaoNegativaProcesso
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TCUCertidaoNegativaProcesso`.
 *
 * @class TCUCertidaoNegativaProcesso
 * @extends {AbstractDirectDataOperation}
 */
export class TCUCertidaoNegativaProcesso extends AbstractDirectDataOperation {
  readonly path = '/api/TCUCertidaoNegativaProcesso';
}
