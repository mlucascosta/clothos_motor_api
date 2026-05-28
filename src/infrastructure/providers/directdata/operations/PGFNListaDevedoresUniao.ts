/**
 * @fileoverview Operation PGFNListaDevedoresUniao — DirectData Marketplace API.
 * Endpoint para realizar a consulta PGFN - Lista de Devedores da União.
 * @module infrastructure/providers/directdata/operations/PGFNListaDevedoresUniao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PGFNListaDevedoresUniao`.
 *
 * @class PGFNListaDevedoresUniao
 * @extends {AbstractDirectDataOperation}
 */
export class PGFNListaDevedoresUniao extends AbstractDirectDataOperation {
  readonly path = '/api/PGFNListaDevedoresUniao';
}
