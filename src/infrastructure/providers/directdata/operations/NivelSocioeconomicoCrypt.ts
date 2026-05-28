/**
 * @fileoverview Operation NivelSocioeconomicoCrypt — DirectData Marketplace API.
 * Endpoint para realizar a consulta de Nível Socioeconômico Crypt. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/NivelSocioeconomicoCrypt
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `NivelSocioeconomico/Crypt`.
 *
 * @class NivelSocioeconomicoCrypt
 * @extends {AbstractDirectDataOperation}
 */
export class NivelSocioeconomicoCrypt extends AbstractDirectDataOperation {
  readonly path = '/api/NivelSocioeconomico/Crypt';
}
