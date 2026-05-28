/**
 * @fileoverview Operation BoaVistaAcertaCompletoPositivoPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta Boa Vista - Acerta Completo Positivo Pessoa Física.
 * @module infrastructure/providers/directdata/operations/BoaVistaAcertaCompletoPositivoPF
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BoaVistaAcertaCompletoPositivoPF`.
 *
 * @class BoaVistaAcertaCompletoPositivoPF
 * @extends {AbstractDirectDataOperation}
 */
export class BoaVistaAcertaCompletoPositivoPF extends AbstractDirectDataOperation {
  readonly path = '/api/BoaVistaAcertaCompletoPositivoPF';
}
