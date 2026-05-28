/**
 * @fileoverview Operation VinculoEmpregaticio — DirectData Marketplace API.
 * Endpoint para realizar a consulta Vínculo Empregatício. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/VinculoEmpregaticio
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `VinculoEmpregaticio`.
 *
 * @class VinculoEmpregaticio
 * @extends {AbstractDirectDataOperation}
 */
export class VinculoEmpregaticio extends AbstractDirectDataOperation {
  readonly path = '/api/VinculoEmpregaticio';
}
