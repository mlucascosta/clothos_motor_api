/**
 * @fileoverview Registry de operations disponíveis no provider BrasilAPI.
 * Segue o padrão factory/registry idêntico ao directdata: cada entrada mapeia
 * um nome de endpoint para uma função que instancia a operation com o cliente HTTP.
 * @module infrastructure/providers/brasilapi/operations/registry
 */

import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IBrasilApiOperation } from '../ports/IBrasilApiOperation.js';
import { Cnpj } from './Cnpj.js';
import { CvmCorretora } from './CvmCorretora.js';
import { CvmCorretoras } from './CvmCorretoras.js';
import { RegistroBr } from './RegistroBr.js';

/**
 * Função de fábrica que recebe um {@link IHttpClient} e retorna uma
 * {@link IBrasilApiOperation} pronta para uso.
 * Permite criar uma nova instância da operation por requisição, evitando
 * estado compartilhado entre chamadas concorrentes.
 */
type OperationFactory = (http: IHttpClient) => IBrasilApiOperation;

/**
 * Mapa de todas as operations registradas no provider BrasilAPI.
 * A chave corresponde ao nome do endpoint recebido na rota (`/:endpoint`).
 *
 * Operations disponíveis:
 * - `cnpj` — dados cadastrais de CNPJ via {@link Cnpj}
 * - `registrobr` — informações de domínio .br via {@link RegistroBr}
 * - `cvm_corretoras` — lista completa de corretoras CVM via {@link CvmCorretoras}
 * - `cvm_corretora` — dados de uma corretora específica via {@link CvmCorretora}
 */
export const brasilapiRegistry: Record<string, OperationFactory> = {
  cnpj: (http) => new Cnpj(http),
  registrobr: (http) => new RegistroBr(http),
  cvm_corretoras: (http) => new CvmCorretoras(http),
  cvm_corretora: (http) => new CvmCorretora(http),
};

/**
 * Resolve e instancia uma operation pelo nome, injetando o cliente HTTP.
 * Lança `Error` (500) se o nome não existir no registry — a rota já verifica
 * a existência antes de chamar esta função, mas o throw serve como garantia.
 *
 * @param name - Nome da operation (ex.: `'cnpj'`, `'registrobr'`).
 * @param http - Cliente HTTP a ser injetado na operation instanciada.
 * @returns A {@link IBrasilApiOperation} pronta para executar.
 * @throws {Error} Se `name` não estiver presente em {@link brasilapiRegistry}.
 *
 * @example
 * const op = resolveOperation('cnpj', new BrasilApiHttpClient());
 * const result = await op.execute({ cnpj: '00000000000191' });
 */
export function resolveOperation(name: string, http: IHttpClient): IBrasilApiOperation {
  const factory = brasilapiRegistry[name];
  if (factory) {
    return factory(http);
  }
  throw new Error(`Operation '${name}' não encontrada no registry brasilapi`);
}
