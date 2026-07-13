import {
  type FinderSourceEnvironment,
  createCnpjFinderSourceRegistry,
} from '@application/finder/FinderSourceRegistryFactory.js';

const environment: FinderSourceEnvironment = {
  ESCAVADOR_API_KEY: 'escavador-token',
  DATAJUD_APIKEY: 'datajud-token',
  DIRECTDATA_TOKEN: 'directdata-token',
};

describe('createCnpjFinderSourceRegistry', () => {
  it('builds supported CNPJ executors with stable profiles and stages', () => {
    const registry = createCnpjFinderSourceRegistry(environment);

    expect(registry.plan({ profile: 'identity' }).map((source) => source.id)).toEqual([
      'directdata',
      'escavador',
    ]);
    expect(registry.plan({ profile: 'judicial' }).map((source) => source.id)).toEqual([
      'escavador',
      'datajud',
    ]);
    expect(registry.plan({ profile: 'full' }).map((source) => source.id)).toEqual([
      'directdata',
      'escavador',
      'datajud',
    ]);
    expect(registry.plan({ profile: 'public_cnpj' }).map((source) => source.id)).toEqual([
      'brasilapi_cnpj',
    ]);
  });

  it('requires Escavador before candidate-driven DataJud execution', () => {
    const registry = createCnpjFinderSourceRegistry(environment);

    expect(registry.plan({ sources: ['datajud'] })).toEqual([
      expect.objectContaining({ id: 'escavador', stage: 1 }),
      expect.objectContaining({
        id: 'datajud',
        stage: 2,
        dependsOn: ['escavador'],
        requiresCandidate: true,
      }),
    ]);
  });

  it('enables Infosimples only when its credential is configured', () => {
    const withoutCredential = createCnpjFinderSourceRegistry(environment);
    const withCredential = createCnpjFinderSourceRegistry({
      ...environment,
      INFOSIMPLES_API_KEY: 'infosimples-token',
    });

    expect(() => withoutCredential.plan({ sources: ['infosimples_cnpj'] })).toThrow(
      'unknown_source',
    );
    expect(withCredential.plan({ sources: ['infosimples_cnpj'] })).toEqual([
      expect.objectContaining({ id: 'infosimples_cnpj', stage: 1 }),
    ]);
  });

  it('fails closed without every configured provider dependency and never exposes token values', () => {
    const token = 'must-not-appear';

    expect(() =>
      createCnpjFinderSourceRegistry({
        ESCAVADOR_API_KEY: token,
        DATAJUD_APIKEY: 'datajud-token',
      }),
    ).toThrow('missing_provider_configuration:DIRECTDATA_TOKEN');
    expect(() =>
      createCnpjFinderSourceRegistry({
        ESCAVADOR_API_KEY: token,
        DATAJUD_APIKEY: 'datajud-token',
      }),
    ).not.toThrow(token);
  });
});
