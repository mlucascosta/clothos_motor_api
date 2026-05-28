/**
 * @fileoverview Operation PEPParentescos — DirectData Marketplace API.
 * Endpoint para realizar a consulta PEP Estendida - Pessoa Exposta Politicamente + Parentescos. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/PEPParentescos
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PEPParentescos`.
 *
 * @class PEPParentescos
 * @extends {AbstractDirectDataOperation}
 */
export class PEPParentescos extends AbstractDirectDataOperation {
  readonly path = '/api/PEPParentescos';
}
