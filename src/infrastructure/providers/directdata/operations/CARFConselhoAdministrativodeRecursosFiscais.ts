/**
 * @fileoverview Operation CARFConselhoAdministrativodeRecursosFiscais — DirectData Marketplace API.
 * Endpoint para realizar a consulta CARF - Conselho Administrativo de Recursos Fiscais. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CARFConselhoAdministrativodeRecursosFiscais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CARFConselhoAdministrativodeRecursosFiscais`.
 *
 * @class CARFConselhoAdministrativodeRecursosFiscais
 * @extends {AbstractDirectDataOperation}
 */
export class CARFConselhoAdministrativodeRecursosFiscais extends AbstractDirectDataOperation {
  readonly path = '/api/CARFConselhoAdministrativodeRecursosFiscais';
}
