/**
 * @fileoverview Operation CarteiraNacionalHabilitacao — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNH - Carteira Nacional de Habilitação. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CarteiraNacionalHabilitacao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CarteiraNacionalHabilitacao`.
 *
 * @class CarteiraNacionalHabilitacao
 * @extends {AbstractDirectDataOperation}
 */
export class CarteiraNacionalHabilitacao extends AbstractDirectDataOperation {
  readonly path = '/api/CarteiraNacionalHabilitacao';
}
