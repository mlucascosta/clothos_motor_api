/**
 * @fileoverview Operation AnbimaCertificadoEDU — DirectData Marketplace API.
 * Endpoint para realizar a consulta Certificado Anbima EDU. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AnbimaCertificadoEDU
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `AnbimaCertificadoEDU`.
 *
 * @class AnbimaCertificadoEDU
 * @extends {AbstractDirectDataOperation}
 */
export class AnbimaCertificadoEDU extends AbstractDirectDataOperation {
  readonly path = '/api/AnbimaCertificadoEDU';
}
