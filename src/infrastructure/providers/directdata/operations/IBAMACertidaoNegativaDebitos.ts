/**
 * @fileoverview Operation IBAMACertidaoNegativaDebitos — DirectData Marketplace API.
 * Endpoint para realizar a consulta IBAMA - Certidão Negativa de Débitos.
 * @module infrastructure/providers/directdata/operations/IBAMACertidaoNegativaDebitos
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `IBAMACertidaoNegativaDebitos`.
 *
 * @class IBAMACertidaoNegativaDebitos
 * @extends {AbstractDirectDataOperation}
 */
export class IBAMACertidaoNegativaDebitos extends AbstractDirectDataOperation {
  readonly path = '/api/IBAMACertidaoNegativaDebitos';
}
