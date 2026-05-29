import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IBrasilApiOperation } from '../ports/IBrasilApiOperation.js';
import { Cnpj } from './Cnpj.js';
import { CvmCorretora } from './CvmCorretora.js';
import { CvmCorretoras } from './CvmCorretoras.js';
import { RegistroBr } from './RegistroBr.js';

type OperationFactory = (http: IHttpClient) => IBrasilApiOperation;

export const brasilapiRegistry: Record<string, OperationFactory> = {
  cnpj: (http) => new Cnpj(http),
  registrobr: (http) => new RegistroBr(http),
  cvm_corretoras: (http) => new CvmCorretoras(http),
  cvm_corretora: (http) => new CvmCorretora(http),
};

export function resolveOperation(name: string, http: IHttpClient): IBrasilApiOperation {
  const factory = brasilapiRegistry[name];
  if (factory) {
    return factory(http);
  }
  throw new Error(`Operation '${name}' não encontrada no registry brasilapi`);
}
