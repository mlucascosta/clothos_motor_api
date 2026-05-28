/**
 * @fileoverview Operation VinculosSocietarios — DirectData Marketplace API.
 * Endpoint para realizar a consulta Vínculos Societários. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/VinculosSocietarios
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `VinculosSocietarios`.
 *
 * @class VinculosSocietarios
 * @extends {AbstractDirectDataOperation}
 */
export class VinculosSocietarios extends AbstractDirectDataOperation {
  readonly path = '/api/VinculosSocietarios';
}
