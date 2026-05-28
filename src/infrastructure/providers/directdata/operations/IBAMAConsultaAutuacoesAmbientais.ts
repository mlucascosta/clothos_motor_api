/**
 * @fileoverview Operation IBAMAConsultaAutuacoesAmbientais — DirectData Marketplace API.
 * Endpoint para realizar a consulta IBAMA - Consulta de Autuações Ambientais.
 * @module infrastructure/providers/directdata/operations/IBAMAConsultaAutuacoesAmbientais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `IBAMAConsultaAutuacoesAmbientais`.
 *
 * @class IBAMAConsultaAutuacoesAmbientais
 * @extends {AbstractDirectDataOperation}
 */
export class IBAMAConsultaAutuacoesAmbientais extends AbstractDirectDataOperation {
  readonly path = '/api/IBAMAConsultaAutuacoesAmbientais';
}
