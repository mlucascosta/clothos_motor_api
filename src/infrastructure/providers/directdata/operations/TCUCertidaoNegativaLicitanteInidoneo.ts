/**
 * @fileoverview Operation TCUCertidaoNegativaLicitanteInidoneo — DirectData Marketplace API.
 * Endpoint para realizar a consulta TCU - Certidão Negativa de Licitante Inidôneo.
 * @module infrastructure/providers/directdata/operations/TCUCertidaoNegativaLicitanteInidoneo
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TCUCertidaoNegativaLicitanteInidoneo`.
 *
 * @class TCUCertidaoNegativaLicitanteInidoneo
 * @extends {AbstractDirectDataOperation}
 */
export class TCUCertidaoNegativaLicitanteInidoneo extends AbstractDirectDataOperation {
  readonly path = '/api/TCUCertidaoNegativaLicitanteInidoneo';
}
