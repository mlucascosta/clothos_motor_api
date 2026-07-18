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
      'directdata_processos',
      'escavador',
      'datajud',
    ]);
    expect(registry.plan({ profile: 'full' }).map((source) => source.id)).toEqual([
      'directdata',
      'directdata_processos',
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

  it('resolves supported Laravel source codes to Motor executors', () => {
    const registry = createCnpjFinderSourceRegistry(environment);

    expect(registry.plan({ sources: ['directdata_qsa'] }).map((source) => source.id)).toEqual([
      'directdata',
    ]);
    expect(registry.plan({ sources: ['escavador_summary'] }).map((source) => source.id)).toEqual([
      'escavador',
    ]);
    expect(registry.plan({ sources: ['datajud_processos'] }).map((source) => source.id)).toEqual([
      'escavador',
      'datajud',
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
    expect(withCredential.plan({ sources: ['infosimples_ceis'] })).toEqual([
      expect.objectContaining({ id: 'infosimples_ceis', stage: 1 }),
    ]);
    expect(withCredential.plan({ sources: ['infosimples_cnep'] })).toEqual([
      expect.objectContaining({ id: 'infosimples_cnep', stage: 1 }),
    ]);
    expect(withCredential.plan({ sources: ['infosimples_cpf'] })).toEqual([
      expect.objectContaining({ id: 'infosimples_cpf', stage: 1 }),
    ]);
    expect(withCredential.plan({ sources: ['infosimples_certidoes'] })).toEqual([
      expect.objectContaining({ id: 'infosimples_certidoes', stage: 1 }),
    ]);
    expect(() => withoutCredential.plan({ sources: ['infosimples_cpf'] })).toThrow(
      'unknown_source',
    );
    expect(() => withoutCredential.plan({ sources: ['infosimples_certidoes'] })).toThrow(
      'unknown_source',
    );
  });

  it('enables ApiBrasil only with both required credentials', () => {
    const withoutDeviceToken = createCnpjFinderSourceRegistry({
      ...environment,
      APIBRASIL_API_KEY: 'api-key',
    });
    const withCredentials = createCnpjFinderSourceRegistry({
      ...environment,
      APIBRASIL_API_KEY: 'api-key',
      APIBRASIL_DEVICE_TOKEN: 'device-token',
    });

    expect(() => withoutDeviceToken.plan({ sources: ['apibrasil_cadastro_pj'] })).toThrow(
      'unknown_source',
    );
    expect(withCredentials.plan({ sources: ['apibrasil_cadastro_pj'] })).toEqual([
      expect.objectContaining({ id: 'apibrasil_cadastro_pj', stage: 1 }),
    ]);
    expect(withCredentials.plan({ sources: ['apibrasil_cadastro_pf'] })).toEqual([
      expect.objectContaining({ id: 'apibrasil_cadastro_pf', stage: 1 }),
    ]);
    expect(withCredentials.plan({ sources: ['apibrasil_score_quod'] })).toEqual([
      expect.objectContaining({ id: 'apibrasil_score_quod', stage: 1 }),
    ]);
    expect(() => withoutDeviceToken.plan({ sources: ['apibrasil_cadastro_pf'] })).toThrow(
      'unknown_source',
    );
    expect(() => withoutDeviceToken.plan({ sources: ['apibrasil_score_quod'] })).toThrow(
      'unknown_source',
    );
  });

  it('enables Fonte Data phase 1/2 sources only when its credential is configured', () => {
    const withoutCredential = createCnpjFinderSourceRegistry(environment);
    const withCredential = createCnpjFinderSourceRegistry({
      ...environment,
      FONTEDATA_API_KEY: 'fontedata-token',
    });

    const phaseSources = [
      'fontedata_ceis',
      'fontedata_processos',
      'fontedata_car',
      'fontedata_cafir',
      'fontedata_veicular',
      'fontedata_veicular_hist',
    ];
    for (const source of phaseSources) {
      expect(() => withoutCredential.plan({ sources: [source] })).toThrow('unknown_source');
      expect(withCredential.plan({ sources: [source] })).toEqual([
        expect.objectContaining({ id: source, stage: 1 }),
      ]);
    }
    expect(withCredential.plan({ profile: 'public_cnpj' }).map((source) => source.id)).toEqual([
      'brasilapi_cnpj',
      'fontedata_cnpj',
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
