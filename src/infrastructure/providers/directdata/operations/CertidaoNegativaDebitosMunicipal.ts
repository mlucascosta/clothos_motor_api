/**
 * @fileoverview Operation CertidaoNegativaDebitosMunicipal — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNDM - Certidão Negativa de Débitos Municipal.
 * @module infrastructure/providers/directdata/operations/CertidaoNegativaDebitosMunicipal
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CertidaoNegativaDebitosMunicipal`.
 *
 * @class CertidaoNegativaDebitosMunicipal
 * @extends {AbstractDirectDataOperation}
 */
export class CertidaoNegativaDebitosMunicipal extends AbstractDirectDataOperation {
  readonly path = '/api/CertidaoNegativaDebitosMunicipal';
}
