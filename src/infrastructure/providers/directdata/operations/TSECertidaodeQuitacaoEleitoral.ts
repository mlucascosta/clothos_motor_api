/**
 * @fileoverview Operation TSECertidaodeQuitacaoEleitoral — DirectData Marketplace API.
 * Endpoint para realizar a consulta TSE - Certidão de Quitação Eleitoral. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/TSECertidaodeQuitacaoEleitoral
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TSECertidaodeQuitacaoEleitoral`.
 *
 * @class TSECertidaodeQuitacaoEleitoral
 * @extends {AbstractDirectDataOperation}
 */
export class TSECertidaodeQuitacaoEleitoral extends AbstractDirectDataOperation {
  readonly path = '/api/TSECertidaodeQuitacaoEleitoral';
}
