/**
 * @fileoverview Operation TSTCertidaoNegativaDebitosTrabalhistas — DirectData Marketplace API.
 * Endpoint para realizar a consulta TST - Certidão Negativa de Débitos Trabalhistas.
 * @module infrastructure/providers/directdata/operations/TSTCertidaoNegativaDebitosTrabalhistas
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TSTCertidaoNegativaDebitosTrabalhistas`.
 *
 * @class TSTCertidaoNegativaDebitosTrabalhistas
 * @extends {AbstractDirectDataOperation}
 */
export class TSTCertidaoNegativaDebitosTrabalhistas extends AbstractDirectDataOperation {
  readonly path = '/api/TSTCertidaoNegativaDebitosTrabalhistas';
}
