/**
 * @fileoverview Leitura de configuração de providers a partir do ambiente.
 * Fail-closed: uma credencial ausente é erro explícito, nunca default silencioso.
 * O nome da variável aparece na mensagem; o **valor** nunca (segredo não vaza em log).
 * @module shared/infrastructure/configuration
 */

export interface ProviderEnvironment {
  readonly [key: string]: string | undefined;
}

export function requiredConfiguration(environment: ProviderEnvironment, name: string): string {
  const value = environment[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`missing_provider_configuration:${name}`);
  }
  return value;
}

export function optionalConfiguration(
  environment: ProviderEnvironment,
  name: string,
): string | undefined {
  const value = environment[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}
