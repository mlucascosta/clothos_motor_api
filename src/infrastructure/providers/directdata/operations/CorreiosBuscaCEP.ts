/**
 * @fileoverview Operation CorreiosBuscaCEP — DirectData Marketplace API.
 * Endpoint para realizar a consulta Correios - Busca CEP. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CorreiosBuscaCEP
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CorreiosBuscaCEP`.
 *
 * @class CorreiosBuscaCEP
 * @extends {AbstractDirectDataOperation}
 */
export class CorreiosBuscaCEP extends AbstractDirectDataOperation {
  readonly path = '/api/CorreiosBuscaCEP';
}
