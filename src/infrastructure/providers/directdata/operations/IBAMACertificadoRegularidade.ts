/**
 * @fileoverview Operation IBAMACertificadoRegularidade — DirectData Marketplace API.
 * Endpoint para realizar a consulta IBAMA - Certificado de Regularidade.
 * @module infrastructure/providers/directdata/operations/IBAMACertificadoRegularidade
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `IBAMACertificadoRegularidade`.
 *
 * @class IBAMACertificadoRegularidade
 * @extends {AbstractDirectDataOperation}
 */
export class IBAMACertificadoRegularidade extends AbstractDirectDataOperation {
  readonly path = '/api/IBAMACertificadoRegularidade';
}
