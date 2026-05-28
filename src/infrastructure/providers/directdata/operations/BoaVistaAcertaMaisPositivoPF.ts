/**
 * @fileoverview Operation BoaVistaAcertaMaisPositivoPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta Boa Vista - Acerta Mais Positivo Pessoa Física.
 * @module infrastructure/providers/directdata/operations/BoaVistaAcertaMaisPositivoPF
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BoaVistaAcertaMaisPositivoPF`.
 *
 * @class BoaVistaAcertaMaisPositivoPF
 * @extends {AbstractDirectDataOperation}
 */
export class BoaVistaAcertaMaisPositivoPF extends AbstractDirectDataOperation {
  readonly path = '/api/BoaVistaAcertaMaisPositivoPF';
}
