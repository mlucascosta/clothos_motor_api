/**
 * @fileoverview Operation UnitedNationsSecurityList — DirectData Marketplace API.
 * Endpoint para realizar a consulta UNSCCL - United Nations Security Council Consolidated List. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/UnitedNationsSecurityList
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `UnitedNationsSecurityList`.
 *
 * @class UnitedNationsSecurityList
 * @extends {AbstractDirectDataOperation}
 */
export class UnitedNationsSecurityList extends AbstractDirectDataOperation {
  readonly path = '/api/UnitedNationsSecurityList';
}
