/**
 * @fileoverview Operation CAFCadastroNacionalAgriculturaPJ — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAF - Cadastro Nacional de Agricultura Familiar - PJ.
 * @module infrastructure/providers/directdata/operations/CAFCadastroNacionalAgriculturaPJ
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CAFCadastroNacionalAgriculturaPJ`.
 *
 * @class CAFCadastroNacionalAgriculturaPJ
 * @extends {AbstractDirectDataOperation}
 */
export class CAFCadastroNacionalAgriculturaPJ extends AbstractDirectDataOperation {
  readonly path = '/api/CAFCadastroNacionalAgriculturaPJ';
}
