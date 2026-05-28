/**
 * @fileoverview Operation CertidaoConjuntaDebitosPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta CCD - Certidão Conjunta de Débitos - Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/CertidaoConjuntaDebitosPessoaJuridica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CertidaoConjuntaDebitosPessoaJuridica`.
 *
 * @class CertidaoConjuntaDebitosPessoaJuridica
 * @extends {AbstractDirectDataOperation}
 */
export class CertidaoConjuntaDebitosPessoaJuridica extends AbstractDirectDataOperation {
  readonly path = '/api/CertidaoConjuntaDebitosPessoaJuridica';
}
